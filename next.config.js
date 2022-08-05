const isDevelopment = process.env.NODE_ENV !== "production";

const rewritesConfig = isDevelopment
  ? [
    {
      source: '/rest/api/:slug*',
      destination: 'http://localhost:3001/:slug*'
    },
  ]
  : [];

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  rewrites: async () => rewritesConfig,
};