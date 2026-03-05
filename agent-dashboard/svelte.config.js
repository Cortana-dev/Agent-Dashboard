import adapter from '@sveltejs/adapter-static';

const basePath = process.env.BASE_PATH ?? '';
const paths = {
	base: basePath
};

if (basePath) {
	paths.assets = basePath;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '200.html'
		}),
		paths,
	}
};

export default config;
