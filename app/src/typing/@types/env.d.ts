declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production"
            DEBUG: string
            APP_ID: string
            APP_KEY: string
        }
    }
}