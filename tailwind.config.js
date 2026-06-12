/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ShotcutCrew Brand
        brand: {
          50:  "#f0edff",
          100: "#e0d9ff",
          200: "#c2b3ff",
          300: "#a38dff",
          400: "#8567ff",
          500: "#6C5CE7",   // Primary
          600: "#5a49d4",
          700: "#4737b0",
          800: "#34268c",
          900: "#221569",
        },
        // Accent - Electric Orange
        accent: {
          50:  "#fff4ed",
          100: "#ffe9db",
          200: "#ffd3b7",
          300: "#ffbd93",
          400: "#ffa76f",
          500: "#FF7043",   // Accent
          600: "#e55f32",
          700: "#cc4e21",
          800: "#b23d10",
          900: "#992c00",
        },
        // Neutrals — Dark mode first
        dark: {
          50:  "#f8f8fc",
          100: "#e8e8f0",
          200: "#c8c8d8",
          300: "#a0a0b8",
          400: "#6b6b85",
          500: "#44445a",
          600: "#2d2d3f",
          700: "#1e1e2d",
          800: "#141421",
          900: "#0A0A0F",   // App background
          950: "#060609",
        },
        surface: {
          DEFAULT: "#141421",
          elevated: "#1e1e2d",
          overlay: "#2d2d3f",
          border: "rgba(255,255,255,0.08)",
        },
        // Status Colors
        success: {
          DEFAULT: "#00B894",
          light: "#55EFC4",
          dark: "#007A63",
        },
        warning: {
          DEFAULT: "#FDCB6E",
          light: "#FFF3CD",
          dark: "#B88A00",
        },
        error: {
          DEFAULT: "#D63031",
          light: "#FF7675",
          dark: "#A01E1E",
        },
        info: {
          DEFAULT: "#0984E3",
          light: "#74B9FF",
          dark: "#0652C9",
        },
        // Trust badges
        verified: "#00B894",
        parichay: "#6C5CE7",
        pending: "#636E72",
        // Text
        text: {
          primary: "#FFFFFF",
          secondary: "rgba(255,255,255,0.70)",
          muted: "rgba(255,255,255,0.40)",
          disabled: "rgba(255,255,255,0.25)",
          inverse: "#0A0A0F",
        },
      },
      fontFamily: {
        "inter-thin":       ["Inter_100Thin"],
        "inter-light":      ["Inter_300Light"],
        "inter":            ["Inter_400Regular"],
        "inter-medium":     ["Inter_500Medium"],
        "inter-semibold":   ["Inter_600SemiBold"],
        "inter-bold":       ["Inter_700Bold"],
        "inter-extrabold":  ["Inter_800ExtraBold"],
        "inter-black":      ["Inter_900Black"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px" }],
        xs:    ["12px", { lineHeight: "16px" }],
        sm:    ["13px", { lineHeight: "18px" }],
        base:  ["15px", { lineHeight: "22px" }],
        lg:    ["17px", { lineHeight: "24px" }],
        xl:    ["19px", { lineHeight: "26px" }],
        "2xl": ["22px", { lineHeight: "30px" }],
        "3xl": ["26px", { lineHeight: "34px" }],
        "4xl": ["32px", { lineHeight: "40px" }],
        "5xl": ["38px", { lineHeight: "46px" }],
      },
      spacing: {
        safe: "env(safe-area-inset-bottom)",
      },
      borderRadius: {
        "4xl": "32px",
        "5xl": "40px",
      },
    },
  },
  plugins: [],
};
