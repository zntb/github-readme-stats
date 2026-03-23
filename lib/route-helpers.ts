import { NextRequest, NextResponse } from "next/server";

/**
 * Extract query parameters from a Next.js request as a plain object.
 */
export function getQuery(request: NextRequest): Record<string, string> {
  const query: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    query[key] = value;
  });
  return query;
}

/**
 * Return an SVG response with proper headers.
 */
export function svgResponse(
  svg: string,
  cacheControl?: string,
): NextResponse {
  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      ...(cacheControl ? { "Cache-Control": cacheControl } : {}),
    },
  });
}

/**
 * Return an error SVG response.
 */
export function errorSvgResponse(svg: string): NextResponse {
  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "max-age=600, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}

/**
 * Return a JSON response.
 */
export function jsonResponse(data: unknown, cacheControl?: string): NextResponse {
  return NextResponse.json(data, {
    headers: {
      ...(cacheControl ? { "Cache-Control": cacheControl } : {}),
    },
  });
}

/**
 * Resolve cache control header string.
 */
export function buildCacheControl(cacheSeconds: number): string {
  return `max-age=${cacheSeconds}, s-maxage=${cacheSeconds}, stale-while-revalidate=86400`;
}

export const ERROR_CACHE = "max-age=600, s-maxage=600, stale-while-revalidate=86400";
export const NO_STORE = "no-store";
