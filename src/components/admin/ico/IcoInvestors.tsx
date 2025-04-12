'use client';

import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

export interface Investor {
  id: string;
  name: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface IcoInvestorsProps {
  investors?: Investor[];
  icoId?: string;
}

export function IcoInvestors({ investors = [], icoId }: IcoInvestorsProps) {
  // Заглушечные данные, если массив пуст
  const defaultInvestors: Investor[] = investors.length ? investors : [
    { id: '1', name: 'Иван Петров', amount: 1500, date: '2023-04-15', status: 'completed' },
    { id: '2', name: 'Елена Смирнова', amount: 2500, date: '2023-04-14', status: 'completed' },
    { id: '3', name: 'Алексей Иванов', amount: 800, date: '2023-04-13', status: 'pending' },
    { id: '4', name: 'Ольга Кузнецова', amount: 3200, date: '2023-04-12', status: 'completed' },
    { id: '5', name: 'Дмитрий Соколов', amount: 750, date: '2023-04-11', status: 'failed' },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Инвесторы ICO {icoId && `#${icoId}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Инвестор</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {defaultInvestors.map((investor) => (
              <TableRow key={investor.id}>
                <TableCell className="font-medium">{investor.name}</TableCell>
                <TableCell>${investor.amount.toLocaleString()}</TableCell>
                <TableCell>{new Date(investor.date).toLocaleDateString('ru-RU')}</TableCell>
                <TableCell>
                  {investor.status === 'completed' ? (
                    <div className="flex items-center">
                      <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                      <span className="text-xs">Завершено</span>
                    </div>
                  ) : investor.status === 'pending' ? (
                    <div className="flex items-center">
                      <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                      <span className="text-xs">В процессе</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <XCircle className="mr-1 h-4 w-4 text-red-500" />
                      <span className="text-xs">Ошибка</span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
