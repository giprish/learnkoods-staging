/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "learnkoods.us-east-2.elasticbeanstalk.comundefined",
      "learnkoods-api.eu-north-1.elasticbeanstalk.comhttps",
      "learnkoods.us-east-2.elasticbeanstalk.comhttps",
      "learnkoods.us-east-2.elasticbeanstalk.comundefined",
      "learnkoods-bucket.s3.amazonaws.com",
      "learnkoods.us-east-2.elasticbeanstalk.com",
      "api.vealo.io",
      "api.vealo.iohttps",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "learnkoods-bucket.s3.amazonaws.com",
        port: "",
        pathname: "static/profile",
      },
    ],
  },
  env: {
    GLOBAL_API: process.env.GLOBAL_API,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  },
};

module.exports = nextConfig;
