/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    DEFAULT: '#0a0a0f',
                    lighter: '#1a1a2e',
                },
                cyan: {
                    electric: '#00d9ff',
                    glow: 'rgba(0, 217, 255, 0.3)',
                },
                purple: {
                    vibrant: '#8b5cf6',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-mesh': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a3e 50%, #2d1b69 100%)',
            },
            animation: {
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
                        opacity: '1',
                    },
                    '50%': {
                        boxShadow: '0 0 40px rgba(0, 217, 255, 0.6)',
                        opacity: '0.8',
                    },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
