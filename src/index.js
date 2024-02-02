/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

addEventListener('fetch', (event) => {
	event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
	const { EMAIL, COUNTRY, TIMESTAMP } = parseUserDetails(request.headers);

	if (request.url.includes('/secure')) {
		const countryFlagLink = `tunnel.tvetechnical.com/secure/${COUNTRY}`;
		const responseText = `${EMAIL} authenticated at ${TIMESTAMP} from <a href="${countryFlagLink}">${COUNTRY}</a>`;

		return new Response(responseText, {
			headers: { 'Content-Type': 'text/html' },
		});
	}

	if (request.url.includes(`/secure/${COUNTRY}`)) {
		// Fetch the country flag from your private R2 bucket
		const flagAsset = await fetchCountryFlag(COUNTRY);

		return new Response(flagAsset, {
			headers: { 'Content-Type': 'image/svg+xml' }, // Replace with the actual content type
		});
	}

	// Handle other paths or return a default response
	return new Response('Not Found', { status: 404 });
}

function parseUserDetails(headers) {
	const EMAIL = headers.get('X-Hub-Email') || 'user@example.com';
	const COUNTRY = headers.get('X-Hub-Country') || 'US';
	const TIMESTAMP = headers.get('X-Hub-Timestamp') || new Date().toISOString();

	return { EMAIL, COUNTRY, TIMESTAMP };
}


async function fetchCountryFlag(country) {
	// Replace the URL with the actual endpoint for fetching the country flag
	const flagResponse = await fetch(`https://example.com/api/flags/${country}`);
	return flagResponse.text();
}


