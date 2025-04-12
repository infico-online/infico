import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET() {
  const data = {
    icos: [
      {
        title: "Example ICO",
        line1: "Blockchain Project",
        line2: "Active",
        line3: "$1,000,000 raised",
        line4: "+25% growth",
        badges: [
          { text: "Premium", variant: "default" },
          { text: "ICO", variant: "secondary" }
        ]
      }
    ],
    investors: [
      {
        title: "John Doe",
        line1: "Angel Investor",
        line2: "Active",
        line3: "$500,000 invested",
        line4: "+15% returns",
        badges: [
          { text: "Angel", variant: "secondary" }
        ]
      }
    ],
    pages: [
      {
        title: "Crypto News",
        line1: "News Channel",
        line2: "Active",
        line3: "10,000 views",
        line4: "+5% growth",
        badges: [
          { text: "Official", variant: "default" }
        ]
      }
    ],
    channels: [
      {
        title: "Crypto Trading",
        line1: "Trading Channel",
        line2: "Active",
        line3: "5,000 followers",
        line4: "+10% growth",
        badges: [
          { text: "Verified", variant: "default" }
        ]
      }
    ]
  };

  return NextResponse.json(data);
}
