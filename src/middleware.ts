import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './config';

export default createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'never'
});

export const config = {
    matcher: ['/', '/(en)/:path*']
};
