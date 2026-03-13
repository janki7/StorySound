/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        backgroundLight: '#FAFAF8',
        surfaceLight: '#F2F1EC',
        surfaceLight2: '#E8E6E0',
        textPrimaryLight: '#1A1A18',
        textSecondaryLight: '#4A4843',
        textMutedLight: '#9E9B93',
        accent: '#F5A623',
        accentDark: '#E09515',
        accentLight: '#FFD080',
        borderLight: '#E2E0D8',

        backgroundDark: '#0F1014',
        surfaceDark: '#1A1B20',
        surfaceDark2: '#242530',
        textPrimaryDark: '#F0EFE9',
        textSecondaryDark: '#B0ADA5',
        textMutedDark: '#6B6866',
        borderDark: '#2A2B30',

        gradStart: '#F5A623',
        gradEnd: '#E86B38',
        success: '#4CAF50',
      },
      fontFamily: {
        lora: ['Lora_400Regular'],
        loraMedium: ['Lora_500Medium'],
      },
    },
  },
  plugins: [],
};
