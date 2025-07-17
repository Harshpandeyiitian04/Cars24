/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enables React Strict Mode
  // Remove fastRefresh as it’s not a valid option
  // Ensure no basePath or assetPrefix unless needed
};

module.exports = nextConfig;