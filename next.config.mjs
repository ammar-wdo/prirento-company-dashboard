/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: [
            {
              protocol: "https",
              hostname: "files.edgestore.dev",
       
            },
            {
              protocol: "http",
              hostname: "res.cloudinary.com",
       
            },
          ]
    },
};

export default nextConfig;
