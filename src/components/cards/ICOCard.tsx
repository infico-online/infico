'use client';

import {  Card  } from "@/components/ui/card";

interface ICOCardProps {
  channel: string;
  apy: number;
  term: number;
  language: string;
  category: string;
  investors: number;
  raised: number;
  goal: number;
  isPremium?: boolean;
  isActive?: boolean;
}

function ICOCard({
  channel,
  apy,
  term,
  language,
  category,
  investors,
  raised,
  goal,
  isPremium,
  isActive
}: ICOCardProps) {
  const progress = Math.round((raised / goal) * 100);

  return (
    <Card className="bg-white rounded-xl shadow-sm">
      <div className="p-4">
        {/* Первая строка: название и бейдж */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-medium">{channel}</h3>
          {isPremium && (
            <span className="px-3 py-1 bg-black text-white text-xs rounded-full">
              PREMIUM
            </span>
          )}
          {isActive && (
            <span className="px-3 py-1 bg-black text-white text-xs rounded-full">
              Active ICO
            </span>
          )}
        </div>
        
        {/* Вторая строка: APY и категория */}
        <div className="text-[15px] text-gray-600 mb-1.5">
          {apy}% APY | {term}m • {language} | {category}
        </div>
        
        {/* Третья строка: количество инвесторов */}
        <div className="text-[15px] text-gray-600 mb-1.5">
          {investors} investors
        </div>

        {/* Четвертая строка: сумма и процент на одной строке */}
        <div className="flex justify-between items-center">
          <div className="text-[15px] text-gray-600">
            {raised.toLocaleString()} / {goal.toLocaleString()} USDT
          </div>
          <div className="text-[15px] text-emerald-600">
            {progress}% raised
          </div>
        </div>
      </div>
    </Card>
  );
}
