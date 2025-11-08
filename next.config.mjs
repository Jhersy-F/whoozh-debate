/** @type {import('next').NextConfig} */
const nextConfig = {

    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals.push({
          tls: 'empty',
          fs: 'empty',
        });
      }
      return config;
    },
    
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'storage.googleapis.com',
          pathname: '/whoozh2/**',
        },
      ],
    },
  };
  
  export default nextConfig;