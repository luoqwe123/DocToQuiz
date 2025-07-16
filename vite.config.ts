import { defineConfig } from "vite";
import  vue from "@vitejs/plugin-vue";
import path from "node:path";

export default defineConfig({
    plugins:[
        vue()
    ],
    resolve:{
        alias:{
            "@": path.join(__dirname,"./src/")
        }
    },
    css:{
        preprocessorOptions:{
            scss:{
                additionalData: `@use "@/styles/variables.scss" as * ;`
            }
        }
    }
})