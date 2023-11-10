import { ElectronAPI } from '@electron-toolkit/preload'
import {ApiService} from "@typing/internal.type.ts";

declare global {
    interface Window {
        electron: ElectronAPI
        api: ApiService
    }
}