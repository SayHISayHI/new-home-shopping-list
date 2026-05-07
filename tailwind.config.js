/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          light: '#fdf6e3', // 浅黄色纸张背景
          dark: '#f4ecd8',  // 稍深的纸张色用于对比
        }
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Songti SC"', 'STZhongsong', 'serif'],
      }
    },
  },
  plugins: [],
}
