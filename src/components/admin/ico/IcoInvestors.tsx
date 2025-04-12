'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,  } from "@/components/ui/table";


interface IcoInvestorsProps {
  transactions: {
    id: string;
    type: string;
    amount: number;
    createdAt: Date;
    investor: {
      name: string;
    };
  }[];
}

function IcoInvestors({ transactions }: IcoInvestorsProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Investor</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell>{tx.investor.name}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                tx.type === 'INVESTMENT' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {tx.type}
              </span>
            </TableCell>
            <TableCell>{tx.amount.toLocaleString()} INFICO</TableCell>
            <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
