/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // The /docs/[...slug] route reads docs/*.md from disk at request time.
    // Serverless hosts only ship traced files, so without this include the
    // docs links 404 once deployed even though the build passes.
    // (On Next 14 this key belongs under experimental; it is top level in 15.)
    outputFileTracingIncludes: {
      '/docs/[...slug]': ['./docs/**/*'],
    },
  },
};

export default nextConfig;
