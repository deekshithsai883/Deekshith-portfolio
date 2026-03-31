/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Allow serving large FBX/GLB files from public/
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf|fbx)$/,
      type: 'asset/resource',
    });
    return config;
  },
};

module.exports = nextConfig;
