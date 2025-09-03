module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'hi', 'mr'],
    localeDetection: false,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  serializeConfig: false,
  ns: [
    'common',
    'auth',
    'dashboard',
    'jobs',
    'chat',
    'profile'
  ],
  defaultNS: 'common',
};