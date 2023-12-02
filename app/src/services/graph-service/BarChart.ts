import * as d3 from "d3";
import classes from "./graph.module.scss"
import { Graph } from "@typing/internal.type";

type BarChartProps<D> = {
    el: HTMLElement
    data: D[]
    x: (d: D) => string  
    y: (d: D) => d3.NumberValue
    range?: {
        yMin?: number, yMax?: number
    }
    textFormat?: (value: D) => string
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

export default class BarChart<D> implements Graph {
    private chartProps: ChartProps
    constructor(private props: BarChartProps<D>, {width = 600, height = 300, marginTop = 30, marginBottom = 140, marginRight = 30, marginLeft = 100}: Partial<ChartProps> = {}) 
    {
        this.chartProps = {width, height, marginLeft, marginBottom, marginRight, marginTop}
    }


    private createBar(container: d3.Selection<SVGGElement, unknown, null, undefined>, xAxis: Xaxis, yAxis: Yaxis ) {
        const {textFormat = (v) => this.props.y(v).toLocaleString("en-US", {maximumFractionDigits: 2}) } = this.props;
        const bar = container.selectAll("bar")
        .data(this.props.data)
        .enter()
        .append("g")

        bar.append("rect")
            .attr("x", (d) => xAxis(this.props.x(d)) ?? 0)
            .attr("y", (d) => yAxis(this.props.y(d)))
            .attr("width", xAxis.bandwidth())
            .attr("height", (d) => this.chartProps.height - yAxis(this.props.y(d)))
            .attr("fill", "var(--dark-primary)")

        bar.append("text")
            .html((d) => textFormat(d))
            .attr("x", (d) => (xAxis(this.props.x(d)) ?? 0)  + xAxis.bandwidth() / 2)
            .attr("y", (d) => yAxis(this.props.y(d)) - 5)
            .attr("text-anchor", "middle")
        return bar;
    }

    private createContainer(xAxis: Xaxis, yAxis: Yaxis) {
        const container = d3.select(this.props.el).append("svg")
        .attr("width", this.chartProps.width + this.chartProps.marginLeft + this.chartProps.marginRight)
        .attr("height", this.chartProps.height + this.chartProps.marginTop + this.chartProps.marginBottom)
        .append("g")
        .attr("transform", `translate(${this.chartProps.marginLeft}, ${this.chartProps.marginTop})`);

        container.append("g")
            .attr("transform", `translate(0, ${this.chartProps.height})`)
            .call(d3.axisBottom(xAxis))
            .selectAll("text")
            .attr("class", classes["chart__x-label"])


        container.append("g")
            .call(d3.axisLeft(yAxis))
            .selectAll("text")
            .attr("class", classes["chart__y-label"])

        return container;
    }

    create() {
        const {
            yMin = d3.min(this.props.data.map((d) => this.props.y(d) )) ?? 0,
            yMax = d3.max(this.props.data.map((d) => this.props.y(d) )) ?? 0
        } = this.props.range ?? {};
        const xAxis = d3.scaleBand()
        .range([0, this.chartProps.width])
        .domain(this.props.data.map((d) => this.props.x(d)))
        .padding(0.2)

        const yAxis = d3.scaleLinear()
        .range([this.chartProps.height, 0])
        .domain([yMin, yMax])

        const container = this.createContainer(xAxis, yAxis );

        this.createBar(container, xAxis, yAxis );
    }

    remove() {
        d3.select(this.props.el).selectAll("*").remove()
    }
}

