// postmonster: supported networks (PRD 5.3).
//
// Source of truth for this file is the integration registry of the app fork
// (app/libraries/nestjs-libraries/src/integrations/social/*.provider.ts).
// `slug` MUST equal the provider `identifier` — `npm run sync-networks`
// (scripts/sync-networks.mjs) fails the build if the sets diverge.
//
// `status` is set by the operator, not by the engine:
//   'available'  - app keys are configured and connecting was verified in prod
//   'on-request' - the integration exists in the engine and is enabled per
//                  workspace on request
// Nothing is shown here that does not exist in code.

export type NetworkStatus = 'available' | 'on-request';

export type NetworkGroup =
  | 'video'
  | 'social'
  | 'communities'
  | 'blogs'
  | 'business';

export type PostType = 'text' | 'image' | 'video' | 'link';

export interface Network {
  /** Provider identifier in the app fork — verified by scripts/sync-networks.mjs */
  slug: string;
  /** Display name */
  name: string;
  group: NetworkGroup;
  /** Key in network-icons.ts (simple-icons slug), null = monogram fallback */
  icon: string | null;
  status: NetworkStatus;
  /** What you can publish to this network */
  postTypes: PostType[];
}

export const groupLabels: Record<NetworkGroup, string> = {
  video: 'Video & short-form',
  social: 'Social',
  communities: 'Communities & chat',
  blogs: 'Blogs & newsletters',
  business: 'Business & design',
};

export const groupOrder: NetworkGroup[] = [
  'video',
  'social',
  'communities',
  'blogs',
  'business',
];

export const postTypeLabels: Record<PostType, string> = {
  text: 'Text',
  image: 'Image',
  video: 'Video',
  link: 'Link',
};

export const networks: Network[] = [
  // --- Video & short-form ---
  { slug: 'tiktok', name: 'TikTok', group: 'video', icon: 'tiktok', status: 'available', postTypes: ['image', 'video'] },
  { slug: 'tiktok-business', name: 'TikTok Business', group: 'video', icon: 'tiktok', status: 'on-request', postTypes: ['image', 'video'] },
  { slug: 'youtube', name: 'YouTube', group: 'video', icon: 'youtube', status: 'on-request', postTypes: ['video'] },
  { slug: 'instagram', name: 'Instagram (Business)', group: 'video', icon: 'instagram', status: 'on-request', postTypes: ['image', 'video'] },
  { slug: 'instagram-standalone', name: 'Instagram (Standalone)', group: 'video', icon: 'instagram', status: 'on-request', postTypes: ['image', 'video'] },
  { slug: 'twitch', name: 'Twitch', group: 'video', icon: 'twitch', status: 'on-request', postTypes: ['text'] },
  { slug: 'kick', name: 'Kick', group: 'video', icon: 'kick', status: 'on-request', postTypes: ['text'] },

  // --- Social ---
  { slug: 'x', name: 'X', group: 'social', icon: 'x', status: 'on-request', postTypes: ['text', 'image', 'video', 'link'] },
  { slug: 'facebook', name: 'Facebook Pages', group: 'social', icon: 'facebook', status: 'on-request', postTypes: ['text', 'image', 'video', 'link'] },
  { slug: 'threads', name: 'Threads', group: 'social', icon: 'threads', status: 'on-request', postTypes: ['text', 'image', 'video'] },
  // simple-icons removed the LinkedIn mark at the brand's request — monogram tile
  { slug: 'linkedin', name: 'LinkedIn', group: 'social', icon: null, status: 'on-request', postTypes: ['text', 'image', 'video', 'link'] },
  { slug: 'linkedin-page', name: 'LinkedIn Pages', group: 'social', icon: null, status: 'on-request', postTypes: ['text', 'image', 'video', 'link'] },
  { slug: 'bluesky', name: 'Bluesky', group: 'social', icon: 'bluesky', status: 'available', postTypes: ['text', 'image', 'video'] },
  { slug: 'mastodon', name: 'Mastodon', group: 'social', icon: 'mastodon', status: 'available', postTypes: ['text', 'image', 'video'] },
  { slug: 'mastodon-custom', name: 'Mastodon (custom instance)', group: 'social', icon: 'mastodon', status: 'on-request', postTypes: ['text', 'image', 'video'] },
  { slug: 'pinterest', name: 'Pinterest', group: 'social', icon: 'pinterest', status: 'on-request', postTypes: ['image', 'video'] },
  { slug: 'reddit', name: 'Reddit', group: 'social', icon: 'reddit', status: 'on-request', postTypes: ['text', 'image', 'video', 'link'] },
  { slug: 'tumblr', name: 'Tumblr', group: 'social', icon: 'tumblr', status: 'on-request', postTypes: ['text', 'image', 'video'] },
  { slug: 'vk', name: 'VK', group: 'social', icon: 'vk', status: 'on-request', postTypes: ['text', 'image', 'video'] },
  { slug: 'mewe', name: 'MeWe', group: 'social', icon: 'mewe', status: 'on-request', postTypes: ['text', 'image'] },
  { slug: 'wrapcast', name: 'Farcaster', group: 'social', icon: 'farcaster', status: 'on-request', postTypes: ['text', 'image'] },
  { slug: 'nostr', name: 'Nostr', group: 'social', icon: null, status: 'on-request', postTypes: ['text'] },
  { slug: 'lemmy', name: 'Lemmy', group: 'social', icon: 'lemmy', status: 'on-request', postTypes: ['text', 'image'] },
  { slug: 'moltbook', name: 'Moltbook', group: 'social', icon: null, status: 'on-request', postTypes: ['text', 'link'] },

  // --- Communities & chat ---
  { slug: 'telegram', name: 'Telegram', group: 'communities', icon: 'telegram', status: 'on-request', postTypes: ['text', 'image', 'video'] },
  { slug: 'discord', name: 'Discord', group: 'communities', icon: 'discord', status: 'on-request', postTypes: ['text', 'image'] },
  { slug: 'slack', name: 'Slack', group: 'communities', icon: 'slack', status: 'on-request', postTypes: ['text', 'image'] },
  { slug: 'skool', name: 'Skool', group: 'communities', icon: null, status: 'on-request', postTypes: ['text', 'image'] },
  { slug: 'whop', name: 'Whop', group: 'communities', icon: null, status: 'on-request', postTypes: ['text', 'image'] },

  // --- Blogs & newsletters ---
  { slug: 'wordpress', name: 'WordPress', group: 'blogs', icon: 'wordpress', status: 'on-request', postTypes: ['text', 'image', 'link'] },
  { slug: 'medium', name: 'Medium', group: 'blogs', icon: 'medium', status: 'on-request', postTypes: ['text', 'image', 'link'] },
  { slug: 'devto', name: 'Dev.to', group: 'blogs', icon: 'devdotto', status: 'on-request', postTypes: ['text', 'image', 'link'] },
  { slug: 'hashnode', name: 'Hashnode', group: 'blogs', icon: 'hashnode', status: 'on-request', postTypes: ['text', 'image', 'link'] },
  { slug: 'listmonk', name: 'Listmonk', group: 'blogs', icon: null, status: 'on-request', postTypes: ['text', 'image'] },

  // --- Business & design ---
  { slug: 'gmb', name: 'Google Business Profile', group: 'business', icon: null, status: 'on-request', postTypes: ['text', 'image'] },
  { slug: 'dribbble', name: 'Dribbble', group: 'business', icon: 'dribbble', status: 'on-request', postTypes: ['image'] },
];

export const networksByGroup = (group: NetworkGroup): Network[] =>
  networks.filter((n) => n.group === group);

export const availableCount = networks.filter(
  (n) => n.status === 'available'
).length;
