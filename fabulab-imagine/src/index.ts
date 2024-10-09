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
  AI: Ai;
	AI_MODEL: BaseAiTextToImageModels;
	AI_PROMPT: string;
}

export default {
  async fetch(request, env, ctx): Promise<Response> {

    const inputs = { prompt: `${env.AI_PROMPT}` };
    const response = await env.AI.run(env.AI_MODEL, inputs);

    return new Response(response, {
      headers: {
        "content-type": "image/png",
      },
    });
  },
} satisfies ExportedHandler<Env>;
