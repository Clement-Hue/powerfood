import { ElectronAPI } from '@electron-toolkit/preload'
import {apiService} from "@services";

declare global {
    interface Window {
        electron: ElectronAPI
        api: typeof apiService
    }
}