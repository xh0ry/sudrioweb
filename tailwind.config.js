import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                ubuntu: ['Ubuntu', 'sans-serif'],
            },
            colors: {
                sudrio: {
                    light: '#4fd1c5',
                    DEFAULT: '#0bc5ea',
                    dark: '#0987a0',
                    accent: '#f6ad55'
                },
                glass: {
                    100: 'rgba(255, 255, 255, 0.1)',
                    200: 'rgba(255, 255, 255, 0.2)',
                    300: 'rgba(255, 255, 255, 0.3)',
                    border: 'rgba(255, 255, 255, 0.15)',
                }
            },
            backgroundImage: {
                'mesh-light': 'radial-gradient(at 40% 20%, hsla(190,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(190,100%,74%,1) 0px, transparent 50%)',
                'mesh-dark': 'radial-gradient(at 40% 20%, hsla(190,100%,20%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,15%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(190,100%,20%,1) 0px, transparent 50%)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },

    plugins: [forms],
};
