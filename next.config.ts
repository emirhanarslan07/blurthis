import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    // buildActivity is now handled differently/automatically or via other props
  },
};

export default withNextIntl(nextConfig);
