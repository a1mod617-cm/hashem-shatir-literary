import { NextRequest, NextResponse } from "next/server";

/** Some browser PDF viewers still request the legacy favicon.ico path. */
export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/favicon.svg", request.url), 308);
}
