import { FreshContext } from "$fresh/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

import { getExchangeRate } from "../../../utils/ecbApi.ts";

const schema = z.object({
  currency: z.string().length(3).toUpperCase(),
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const handler = async (req: Request, ctx: FreshContext) => {
  const origin = req.headers.get("Origin") || "*";
  let { currency } = ctx.params;
  let start = ctx.url.searchParams.get("start") ?? undefined;
  let end = ctx.url.searchParams.get("end") ?? undefined;
  try {
    ({ currency, start, end } = schema.parse({ currency, start, end }));
  } catch (e) {
    return new Response(e.message, {
      status: 400,
      headers: { "Access-Control-Allow-Origin": origin },
    });
  }
  const data = await getExchangeRate(currency, start, end);
  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": origin,
    },
  });
};
