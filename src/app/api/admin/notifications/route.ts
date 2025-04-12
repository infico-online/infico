import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET(
  request: Request,
  { params }: { params: { id?: string } }
) {
  try {
    // Ваш существующий код здесь
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Route', 'Error in route', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
