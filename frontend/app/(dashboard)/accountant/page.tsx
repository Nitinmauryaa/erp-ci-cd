"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { unwrapBackendList } from "@/lib/api/pagination";

interface FeeRow {
  id: number;
  student_id: number;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  status: string;
}

export default function AccountantDashboardPage() {
  const [fees, setFees] = useState<FeeRow[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = await apiClient.get<unknown>("/fees", { skip: 0, limit: 200 });
      const rows = unwrapBackendList<FeeRow>(payload);
      setFees(rows);
    })();
  }, []);

  const totals = useMemo(() => {
    return fees.reduce(
      (acc, fee) => {
        acc.total += Number(fee.total_amount || 0);
        acc.paid += Number(fee.paid_amount || 0);
        acc.balance += Number(fee.balance_amount || 0);
        return acc;
      },
      { total: 0, paid: 0, balance: 0 }
    );
  }, [fees]);

  return (
    <div className="space-y-6">
      <PageHeader title="Accountant Dashboard" description="Live financial data from database." />
      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Fee Records</p><p className="text-2xl font-bold">{fees.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Amount</p><p className="text-2xl font-bold">{totals.total.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Paid Amount</p><p className="text-2xl font-bold">{totals.paid.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Balance Amount</p><p className="text-2xl font-bold">{totals.balance.toFixed(2)}</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Recent Fee Records</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {fees.slice(0, 15).map((fee) => (
            <div key={fee.id} className="rounded border p-2 text-sm">
              <p className="font-medium">Student #{fee.student_id} - {fee.status}</p>
              <p className="text-muted-foreground">
                Total: {fee.total_amount} | Paid: {fee.paid_amount} | Balance: {fee.balance_amount}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
