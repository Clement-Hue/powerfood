import * as d3 from "d3";
import classes from "./graph.module.scss"

type BarChartProps<D> = {
    el: HTMLElement
    data: D[]
    x: (d: D) => string  
    y: (d: D) => d3.NumberValue
    range?: {
        yMin?: number, yMax?: number
    }
}

type ChartProps = {
    width: number
    height: number
    marginLeft: number
    marginRight: number
    marginBottom: number
    marginTop: number
}

type Xaxis = d3.ScaleBand<string>
type Yaxis = d3.ScaleLinear<number, number, never>

export default class BarChart<D> {
    constructor(private props: BarChartProps<D>) 
    {}


    private createBar(container: d3.Selection<SVGGElement, unknown, null, undefined>, xAxis: Xaxis, yAxis: Yaxis, chartProps: ChartProps) {
        const bar = container.selectAll("bar")
        .data(this.props.data)
        .enter()
        .append("g")

        bar.append("rect")
            .attr("x", (d) => xAxis(this.props.x(d)) ?? 0)
            .attr("y", (d) => yAxis(this.props.y(d)))
            .attr("width", xAxis.bandwidth())
            .attr("height", (d) => chartProps.height - yAxis(this.props.y(d)))
            .attr("fill", "var(--dark-primary)")

        bar.append("text")
            .text((d) => this.props.y(d).toLocaleString("en-US", {maximumFractionDigits: 2}))
            .attr("x", (d) => (xAxis(this.props.x(d)) ?? 0)  + xAxis.bandwidth() / 2)
            .attr("y", (d) => yAxis(this.props.y(d)) - 5)
            .attr("text-anchor", "middle")
        return bar;
    }

    private createContainer(xAxis: Xaxis, yAxis: Yaxis, chartProps: ChartProps) {
        const container = d3.select(this.props.el).append("svg")
        .attr("width", chartProps.width + chartProps.marginLeft + chartProps.marginRight)
        .attr("height", chartProps.height + chartProps.marginTop + chartProps.marginBottom)
        .append("g")
        .attr("transform", `translate(${chartProps.marginLeft}, ${chartProps.marginTop})`);

        container.append("g")
            .attr("transform", `translate(0, ${chartProps.height})`)
            .call(d3.axisBottom(xAxis))
            .selectAll("text")
            .attr("class", classes["chart__x-label"])


        container.append("g")
            .call(d3.axisLeft(yAxis))
            .selectAll("text")
            .attr("class", classes["chart__y-label"])

        return container;
    }

    create(chartProps: ChartProps = { width: 500, height: 300, marginTop: 30, marginRight: 30, marginBottom: 130, marginLeft: 100, }) {
        const xAxis = d3.scaleBand()
        .range([0, chartProps.width])
        .domain(this.props.data.map((d) => this.props.x(d)))
        .padding(0.2)

        const yAxis = d3.scaleLinear()
        .range([chartProps.height, 0])
        .domain([this.props.range?.yMin ?? d3.min(this.props.data.map((d) => this.props.y(d) )) ?? 0
            , this.props.range?.yMax ?? d3.max(this.props.data.map((d) => this.props.y(d) )) ?? 0])

        const container = this.createContainer(xAxis, yAxis, chartProps);

        this.createBar(container, xAxis, yAxis, chartProps);
    }

    remove() {
        d3.select(this.props.el).selectAll("*").remove()
    }
}

