// postmonster: site-wide config. Values that come from build-time env
// (see .env.example / Dockerfile build args) have honest defaults so the
// site also builds without any env set.

const env = import.meta.env;

export const site = {
  name: 'Postmonster',
  tagline: 'Feed the feed.',
  description:
    'Plan, schedule and publish to every network from one calm calendar. Early Access for creators and small teams.',
  url: 'https://postmonster.xyz',
  appUrl: env.PUBLIC_APP_URL ?? 'https://app.postmonster.xyz',
  apiBase: env.PUBLIC_APP_API_URL ?? 'https://app.postmonster.xyz/api',
  sourceCodeUrl:
    env.PUBLIC_SOURCE_CODE_URL ?? 'https://github.com/fiveppm/postm',
  operatorName: env.PUBLIC_OPERATOR_NAME ?? 'Postmonster',
  legalName: env.PUBLIC_OPERATOR_LEGAL_NAME ?? '[OPERATOR_LEGAL_NAME]',
  country: env.PUBLIC_OPERATOR_COUNTRY ?? '[COUNTRY/STATE]',
  effectiveDate: env.PUBLIC_EFFECTIVE_DATE ?? '[EFFECTIVE_DATE]',
} as const;

export const emails = {
  support: 'support@postmonster.xyz',
  hello: 'hello@postmonster.xyz',
  privacy: 'privacy@postmonster.xyz',
} as const;

export const nav = [
  { href: '/features', label: 'Features' },
  { href: '/networks', label: 'Networks' },
  { href: '/early-access', label: 'Early Access' },
  { href: '/about', label: 'About' },
] as const;

export const footerNav = [
  {
    title: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/networks', label: 'Networks' },
      { href: '/early-access', label: 'Early Access' },
      { href: '/request-access', label: 'Request access' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/login', label: 'Log in' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  },
] as const;
