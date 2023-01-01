module.exports = {
  content: [
    './src/client/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        skin: {
          red: 'var(--color-red)',
          blue: 'var(--color-blue)',
        },
      },
      backgroundImage: {
        'skin-gradient': 'linear-gradient(90deg, var(--color-red) 0%, var(--color-blue) 100%)',
      },
      boxShadow: {
        slim: '0 2px 0',
        semi: '0 8px 0',
        fat: '0 10px 0 #000',
      },
      colors: {
        skin: {
          red: 'var(--color-red)',
          blue: 'var(--color-blue)',
        },
      },
      fontFamily: {
        roboto: "'Roboto', monospace",
      },
      translate: {
        button: '6px',
      },
    },
  },
  plugins: [],
};
