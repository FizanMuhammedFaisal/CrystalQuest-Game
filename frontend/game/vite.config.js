import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";
var REMOTE_URL = "http://localhost:8080";
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        federation({
            name: "game",
            filename: "remoteEntry.js",
            exposes: {
                "./Game": "./src/App.tsx",
                "./assets": "./src/assets/index.ts",
                "./GameUI.tsx": "./src/components/GameUI.tsx",
            },
            shared: ["react", "react-dom"],
        }),
    ],
    base: REMOTE_URL, // This fixes the asset URLs
    build: {
        target: "esnext",
        minify: false,
        modulePreload: false,
        cssCodeSplit: false,
        assetsInlineLimit: 0,
        rollupOptions: {
            output: {
                assetFileNames: function (assetInfo) {
                    return "assets/".concat(assetInfo.name);
                },
            },
        },
    },
});
