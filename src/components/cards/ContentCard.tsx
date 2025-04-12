'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContentCardProps {
  title: string;
  line1: string;
  line2?: string;
  line3?: string;
  line4?: string;
  badges?: Array<{ text: string; variant?: 'default' | 'secondary' | 'destructive' | 'outline' }>;
}

export function ContentCard({
  title,
  line1,
  line2,
  line3,
  line4,
  badges = []
}: ContentCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{line1}</p>
          {line2 && <p className="text-sm">{line2}</p>}
          {line3 && <p className="text-sm font-medium">{line3}</p>}
          {line4 && <p className="text-sm text-muted-foreground">{line4}</p>}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {badges.map((badge, index) => (
                <Badge key={index} variant={badge.variant || 'secondary'}>
                  {badge.text}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
