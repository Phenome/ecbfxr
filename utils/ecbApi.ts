import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

type ApiResponse = {
  dataSets: {
    series: Record<string, {
      observations: Record<string, Array<number | null>>;
    }>;
  }[];
  structure: {
    dimensions: {
      observation: {
        values: {
          id: string;
          name: string;
          start: string;
          end: string;
        }[];
      }[];
    };
  };
};

const schema = z.object({
  currency: z.string().length(3).toUpperCase(),
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
export async function getExchangeRate(
  currency: string,
  /** Start date: YYYY-MM-DD. Defaults to start of month */
  start?: string,
  /** End date: YYYY-MM-DD. Defaults to today */
  end?: string,
) {
  schema.parse({ currency, start, end });
  if (!start) {
    const startDate = new Date();
    startDate.setHours(1, 0, 0, 0);
    if (new Date().getDate() === 1) {
      startDate.setMonth(startDate.getMonth() - 1);
    }
    start = startDate.toISOString().slice(0, 8) + "01";
  }
  end = end ?? new Date().toISOString().slice(0, 10);
  const response = await fetch(
    `https://data-api.ecb.europa.eu/service/data/EXR/D.${currency}.EUR.SP00.A?startPeriod=${start}&endPeriod=${end}&format=jsondata`,
  );

  const text = await response.text();

  if (text === "No results found.") {
    return [];
  }
  if (!response.headers.get("content-type")?.includes("json")) {
    console.error("Unexpected response from ECB API", text);
    return [];
  }
  const data = JSON.parse(text) as ApiResponse;

  const series = Object.values(data?.dataSets?.[0]?.series)?.[0]?.observations;
  const observations = data?.structure?.dimensions?.observation?.[0]?.values;
  if (!series || !observations) {
    return [];
  }

  return Object.values(series).map((value, index) => ({
    date: observations?.[index]?.name,
    value: value?.[0],
  }));
}
