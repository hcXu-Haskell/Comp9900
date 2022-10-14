/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "d2syaugtnopsqd.cloudfront.net",
      "bucket-api.commercialrealestate.com.au",
      "image.shutterstock.com",
      "hips.hearstapps.com",
      "www.parkhound.com.au",
      "s1.ax1x.com",
    ],
  },
};

module.exports = nextConfig;
