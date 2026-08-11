import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/coffee-ratio-calculator",
        destination: "/v60-calculator",
        permanent: true,
      },
      {
        source: "/:locale(ar|en)/coffee-ratio-calculator",
        destination: "/:locale/v60-calculator",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
