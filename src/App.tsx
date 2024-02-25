import { z } from "zod";

// define a schema for the expected api response data
const PriceChangeSchema = z.object({
  date: z.coerce.date(), // convert strings such as "2024-02-26T17:51:06.4169317+00:00" to a Date
  priceList: z.string().min(1), // must be at least 1 char
  currency: z.string().max(3), // must be at most 3 chars
  productCode: z.string().length(9), // must be 9 chars
  priceInCents: z.number().int().positive(), // must be a positive integer
  reason: z.string().nullable(), // string can be null
});

// extract the TypeScript type from the schema
export type PriceChange = z.infer<typeof PriceChangeSchema>;

// fetch json, parse with PriceChangeSchema, log success/error
async function getPriceChange(url: string, allowPassthrough?: boolean) {
  const response = await fetch(url);
  const data = await response.json();
  const result = !allowPassthrough
    ? PriceChangeSchema.safeParse(data)
    : PriceChangeSchema.passthrough().safeParse(data);
  console.log(result.success ? result.data : result.error);
}

export function App() {
  return (
    <>
      <h1>Test cases</h1>
      <p>Inspect the console after clicking each button.</p>
      <button onClick={() => getPriceChange("/success.json")}>Success</button>
      <button onClick={() => getPriceChange("/success.json", true)}>
        Success (passthrough)
      </button>
      <button onClick={() => getPriceChange("/missing-property.json")}>
        Missing property
      </button>
      <button onClick={() => getPriceChange("/incorrect-type.json")}>
        Incorrect Type
      </button>
      <button onClick={() => getPriceChange("/invalid-data.json")}>
        Invalid data
      </button>
    </>
  );
}
