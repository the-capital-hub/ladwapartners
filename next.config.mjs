/** @type {import('next').NextConfig} */
const nextConfig = {
        images: {
                domains: ["res.cloudinary.com", "ladwas.com"],
                remotePatterns: [
                        {
                                protocol: "https",
                                hostname: "drive.google.com",
                                pathname: "/**",
                        },
                        {
                                protocol: "https",
                                hostname: "lh*.googleusercontent.com",
                                pathname: "/**",
                        },
                ],
        },
};

export default nextConfig;
