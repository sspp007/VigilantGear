/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    DEFAULT: "#071D35",
                    deep: "#0B2545",
                },
                brand: {
                    DEFAULT: "#FF6900",
                    dark: "#EA5800",
                },
                surface: {
                    info: "#EAF4FF",
                    success: "#E9FBEF",
                    danger: "#FFF0F1",
                    accent: "#F1ECFF",
                    warning: "#FFF6DF",
                },
                canvas: "#F5F7FC",
                line: "#E0E7F2",
                ink: {
                    DEFAULT: "#101B32",
                    muted: "#52627D",
                },
            },
            fontFamily: {
                sans: ['"Inter Variable"', "Inter", "system-ui", "sans-serif"],
            },
            boxShadow: {
                card: "0 8px 30px rgba(16, 27, 50, 0.06)",
                soft: "0 2px 10px rgba(16, 27, 50, 0.05)",
            },
        },
    },
    plugins: [],
};
