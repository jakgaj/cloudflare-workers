/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  AQI_API_KEY: string;
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    let endpoint = "https://api.waqi.info/feed/geo:";
    const token = `${env.AQI_API_KEY}`; // Use a token from https://aqicn.org/api/
    
		let html_style = `body{padding:6em; font-family: sans-serif;} h1{color:#f6821f}`;
		let html_content_intro = "";
		let html_content = "";

    const latitude = request.cf.latitude;
    const longitude = request.cf.longitude;
    endpoint += `${latitude};${longitude}/?token=${token}`;
    const init = {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    };

    const response = await fetch(endpoint, init);
    const content = await response.json();
		
		html_content += `You are located at: <b>${latitude},${longitude}</b>. [<a href="https://www.google.com/maps/@${latitude},${longitude}">Google Maps</a>]</p>`;
    html_content += `<p>Based off sensor data from <a href="${content.data.city.url}">${content.data.city.name}</a>:</p>`;
    html_content += `<p>The AQI level is: ${content.data.aqi}.</p>`;
    html_content += `<p>The N02 level is: ${content.data.iaqi.no2?.v}.</p>`;
    html_content += `<p>The O3 level is: ${content.data.iaqi.o3?.v}.</p>`;
    html_content += `<p>The temperature is: ${content.data.iaqi.t?.v}°C.</p>`;

    let html = `
      <!DOCTYPE html>
      <head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<title>Fabulab | Air Quality Index</title>
				<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
				<style>
					body {
							background-color: #ffffff;
							color: #999999;
					}
					.panel {
							padding: 20px;
							margin: 20px;
							border-radius: 0px;
					}
				</style>
			</head>
      <body>
				<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
				<div class="container-sm">&nbsp;</div>
				<div class="container-sm">
					<div class="card">
						<h5 class="card-header">Fabulab Demo</h5>
						<div class="card-body">
							<h5 class="card-title">Air Quality Index</h5>
							<div class="alert alert-light" role="alert">
								<p class="card-text">This is a serverless app running on CloudFlare Workers. This is a demo using Workers geolocation data.</p>
							</div>
							<ul class="list-group list-group-flush">
								<li class="list-group-item">You are located at: <code>${latitude},${longitude}</code> <a href="https://www.google.com/maps/@${latitude},${longitude}" target="_blank" class="btn btn-outline-dark btn-sm">Google Maps</a></li>
								<li class="list-group-item">Based off sensor data from <code>${content.data.city.name}</code> <a href="${content.data.city.url}" target="_blank" class="btn btn-outline-dark btn-sm">Air Quality Index</a></li>
								<li class="list-group-item">The AQI level is: <code>${content.data.aqi}</code>.</li>
								<li class="list-group-item">The N02 level is: <code>${content.data.iaqi.no2?.v}</code>.</li>
								<li class="list-group-item">The O3 level is: <code>${content.data.iaqi.o3?.v}.</code>.</li>
								<li class="list-group-item">The temperature is: <code>${content.data.iaqi.t?.v}°C</code>.</li>
							</ul>
						</div>
					</div>
				</div>
      </body>`;

    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  },
} satisfies ExportedHandler<Env>;
