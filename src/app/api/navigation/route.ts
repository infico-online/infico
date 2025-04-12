import { NextResponse } from "next/server";
import { PrismaClient, AdvertisementStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();

    const updatedItem = await prisma.advertisement.update({
      where: { id: params.id },
      data: {
        status: status as AdvertisementStatus
      }
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    logger.error('Update Status', 'Failed to update status', error);
    return NextResponse.json(
      { error: 'Failed to update status' }, 
      { status: 500 }
    );
  }
}
