import {  Card  } from "@/components/ui/card";
import {  Progress  } from "@/components/ui/progress";

interface ICOCardProps {
  channel: string;
  apy: number;
  term: number;
  language: string;
  category: string;
  investors: number;
  raised: number;
  goal: number;
}

function ICOCard({
  channel,
  apy,
  term,
  language,
  category,
  investors,
  raised,
  goal
}: ICOCardProps) {
  const progress = Math.round((raised / goal) * 100);

  return (
    <Card className="p-4 bg-white rounded-xl">
      <div className="space-y-2">
        <h3 className="text-base font-medium">{channel}</h3>
        
        <div className="text-sm text-muted-foreground">
          {apy}% APY | {term}m • {language} | {category}
        </div>
        
        <div className="text-sm text-muted-foreground">
          {investors} investors
        </div>

        <Progress value={progress} className="h-1.5" />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{raised.toLocaleString()} / {goal.toLocaleString()} USDT</span>
          <span>{progress}%</span>
        </div>
      </div>
    </Card>
  );
}
