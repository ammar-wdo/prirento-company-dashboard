/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: [
            {
              protocol: "https",
              hostname: "files.edgestore.dev",
       
            },
            {
              protocol: "https",
              hostname: "res.cloudinary.com",
       
            },
          ]
    },
};

export default nextConfig;
