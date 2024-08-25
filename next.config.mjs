/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out', // Change this if you prefer another directory name
  images: {
    unoptimized: true, // Disable Image Optimization as it's not supported by GitHub Pages
  },
  trailingSlash: true, // Ensures all paths are treated as directories
};
  export default nextConfig;
  