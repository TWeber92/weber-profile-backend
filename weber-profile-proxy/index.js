import { handler as putProject } from "./functions/putProject";
import { handler as getProject } from "./functions/getProject";
import { handler as resetDatabase } from "./functions/reset";

export default {
  async fetch(request, env) {
    const ALLOWED = new Set([
      "http://localhost:5500",
      "https://tweber92.github.io",
    ]);
    const origin = request.headers.get("Origin");
    const allowOrigin = ALLOWED.has(origin) ? origin : "null";
    const corsHeaders = {
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization", // Added Authorization
      "Access-Control-Allow-Credentials": "true",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const event = {
      path: url.pathname,
      httpMethod: request.method,
      headers: Object.fromEntries(request.headers),
      queryStringParameters: Object.fromEntries(url.searchParams),
      body: await request.text(),
    };

    const routerMap = {
      "GET:/api/v1/project": async () => await getProject(event, env),
      "PUT:/api/v1/project": async () => await putProject(event, env),
      "PUT:/api/v1/reset": async () => {
        const client = await resetDatabase(env);
        if (client) await client.end();
        return { status: 200, body: { ok: true } };
      },
    };

    const router = routerMap[`${request.method}:${url.pathname}`];
    if (!router) {
      return new Response("Not Found", { status: 404, headers: corsHeaders });
    }

    try {
      const response = await router();

      return new Response(
        typeof response.body === "string"
          ? response.body
          : JSON.stringify(response.body),
        {
          status: response.status || 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status || 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  },

  async scheduled(controller, env, ctx) {
    let client;
    try {
      client = await resetDatabase(env);
    } catch (error) {
      console.error("Cron Job Failed:", error);
    } finally {
      if (client) await client.end();
    }
  },
};
