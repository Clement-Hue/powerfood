

export default function request(url: string,
    {queries = {}, method = "GET"}: {queries?: Record<string, string | number | boolean>, method?: string} = {}) {
    const appID = "5a2166a9"
    const appKey = "6c7e3b3f97c039a9c73b230d51eec319";
    const urlQuery = Object.entries(queries).reduce((prev, [key, value]) => {
        if (value === "") {
            return prev;
        }
        prev += (!prev ? "?" : "&") + `${key}=${value}`;
        return prev;
    }, "")
    return fetch(`https://trackapi.nutritionix.com/v2/${url}${urlQuery}`, {
        method,
        headers: {
            "x-app-id": appID,
            "x-app-key": appKey,
            "x-remote-user-id": "0"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
}