export type DigestPrimitive = string | number | boolean | null;

export type DigestJsonValue =
  | DigestPrimitive
  | readonly DigestJsonValue[]
  | {
      readonly [key: string]: DigestJsonValue;
    };

export function stableStringifyDigestValue(value: DigestJsonValue): string {
  if (value === null) {
    return "null";
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringifyDigestValue(item)).join(",")}]`;
  }

  const entries = Object.entries(value).sort(([firstKey], [secondKey]) =>
    firstKey.localeCompare(secondKey),
  );

  return `{${entries
    .map(([key, entryValue]) => {
      return `${JSON.stringify(key)}:${stableStringifyDigestValue(entryValue)}`;
    })
    .join(",")}}`;
}

export function createDigest(value: DigestJsonValue): string {
  const input = stableStringifyDigestValue(value);
  let hash = 2_166_136_261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}
