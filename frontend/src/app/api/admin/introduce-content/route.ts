import { NextResponse } from "next/server";
import {
  normalizeIntroduceContent,
  readIntroduceContent,
  writeIntroduceContent,
} from "@/lib/introduce-content";
import type { IntroducePageContent } from "@/types/introduce";

export const runtime = "nodejs";

export async function GET() {
  try {
    const content = await readIntroduceContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json(
      { message: "Không thể đọc nội dung trang giới thiệu." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const current = await readIntroduceContent();
    const payload = (await request.json()) as Partial<IntroducePageContent>;
    const content = normalizeIntroduceContent(payload, current);

    await writeIntroduceContent(content);

    return NextResponse.json(content);
  } catch {
    return NextResponse.json(
      { message: "Không thể lưu nội dung trang giới thiệu." },
      { status: 500 },
    );
  }
}
