/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:3000/:path*'
      }
    ]
  }
};

export default nextConfig;
