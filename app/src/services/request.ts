

export default function request(url: string,
    {queries = {}, method = "GET", body}: {
        queries?: Record<string, string | number | boolean>,
        body?: Record<string, string | number | boolean>
        method?: string} = {}) {
    const appID = process.env.APP_ID
    const appKey = process.env.APP_KEY;
    const urlQuery = Object.entries(queries).reduce((prev, [key, value]) => {
        if (value === "") {
            return prev;
        }
        prev += (!prev ? "?" : "&") + `${key}=${value}`;
        return prev;
    }, "")
    return fetch(`https://trackapi.nutritionix.com/v2/${url}${urlQuery}`, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
            "Content-Type": "application/json",
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