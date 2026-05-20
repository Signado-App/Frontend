import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['signado.cz', 'cogwheel-spectator-idealness.ngrok-free.dev'],
  reactCompiler: true,
  sassOptions: {
    additionalData: `$var: red;`,
  },
};

export default nextConfig;
