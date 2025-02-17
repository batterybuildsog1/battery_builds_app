import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.alias['@mui/icons-material'] = require.resolve('@mui/icons-material');
    return config;
  }
};

export default nextConfig;
