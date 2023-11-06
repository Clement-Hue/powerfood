declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production"
            DEBUG: string
            API_BASE_URL: string
        }
    }
}