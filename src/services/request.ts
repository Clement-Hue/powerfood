

export default function request(url: string, {query = ""} = {}) {
    const apiKey = 'U94IF0fhW06hYlrUJEY73YTLsCOAUvzxr4cPaoMt';
    return fetch(`https://api.nal.usda.gov/fdc/${url}?api_key=${apiKey}${query}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
}