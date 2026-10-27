import { NextResponse } from "next/server";
import { getBooks } from "../../lib/books";
export const runtime="edge";
export async function GET(){return NextResponse.json({books:await getBooks()})}
