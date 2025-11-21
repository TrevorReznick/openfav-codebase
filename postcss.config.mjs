/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-preset-env': {
      features: {
        'color-functional-notation': true,
      },
    },
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
