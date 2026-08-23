// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'SF',
			cssVariable: '--font-sf',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/blackitalic.otf'],
						weight: 400,
						style: 'italic',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/bold.otf'],
						weight: 800,
						style: 'normal',
						display: 'swap',
					}, {
						src: ['./src/assets/fonts/medium.otf'],
						weight: 500,
						style: 'normal',
						display: 'swap',
					}, {
						src: ['./src/assets/fonts/regular.otf'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},{
						src: ['./src/assets/fonts/heavyitalic.otf'],
						weight: 500,
						style: 'italic',
						display: 'swap',
					}
				],
			},
		},
	],
});
