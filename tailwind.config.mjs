/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
    content: [
        "./src/**/*.{astro,html,js,jsx,svelte}",
    ],
    darkMode: "class",
    theme: {
        colors: {
            transparent: "transparent",
            current: "currentColor",
            black: "#000000",
            white: "#ffffff",
            yellow: {
                50: "#fefce8",
                100: "#fef9c3",
                400: "#facc15",
                500: "#eab308"
            },
            orange: {
                100: "#ffedd5",
                200: "#fed7aa",
                300: "#fb713b",
                400: "#fa5a15",
                500: "#e14d0b"
            },
        },
        extend: {
            backgroundImage: {
                'gradient-amber': 'linear-gradient(to right, #FFCE00, #FF9900, #FF6600)'
            }
        }
    },
    plugins: [
        require("tailwindcss/nesting"),
        require("preline/plugin"),
        require("@tailwindcss/forms")
    ]
};