/**
 * GET — whether the browser has full A&P study access (purchase cookie).
 * Lecture 1 is always free client-side; this flag unlocks lectures 2–12.
 */
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ANATOMY_STUDY_FULL_COOKIE,
  ANATOMY_STUDY_FULL_COOKIE_VALUE,
} from "@/config/anatomy-study.config";

export async function GET() {
  const jar = cookies();
  const fullAccess =
    jar.get(ANATOMY_STUDY_FULL_COOKIE)?.value === ANATOMY_STUDY_FULL_COOKIE_VALUE;
  return NextResponse.json({ fullAccess });
}
