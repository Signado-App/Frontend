import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['signado.cz', 'cogwheel-spectator-idealness.ngrok-free.dev'],
  reactCompiler: true,
  sassOptions: {
    additionalData: `$var: red;`,
  },
  async rewrites() {
    return [
      { source: '/z/ukazka', destination: '/z/ukazka.html' },
      { source: '/cenik', destination: '/cenik.html' },
      { source: '/jak-to-funguje', destination: '/jak-to-funguje.html' },
      { source: '/bezpecnost', destination: '/bezpecnost.html' },
      { source: '/srovnani', destination: '/srovnani.html' },
      { source: '/caste-otazky', destination: '/caste-otazky.html' },
      { source: '/o-nas', destination: '/o-nas.html' },
      { source: '/kontakt', destination: '/kontakt.html' },
      { source: '/podminky-pouziti', destination: '/podminky-pouziti.html' },
      { source: '/ochrana-osobnich-udaju', destination: '/ochrana-osobnich-udaju.html' },
      { source: '/blog', destination: '/blog/index.html' },
      { source: '/produkt/:slug', destination: '/produkt/:slug.html' },
      { source: '/reseni', destination: '/#obory' },
      { source: '/reseni/:slug', destination: '/reseni/:slug.html' },
    ];
  },
};

export default nextConfig;
