import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  sassOptions: {
    additionalData: `$var: red;`,
  },
};

export default nextConfig;
