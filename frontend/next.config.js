/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // 👇 THIS LINE FIXES YOUR BUILD
  turbopack: {},

  // Keep your custom webpack config
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf|fbx)$/,
      type: 'asset/resource',
    });
    return config;
  },
};

module.exports = nextConfig;