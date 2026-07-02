"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";

interface ScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remaining: number;
}

function formatMoney(n: number) {
  return n.toLocaleString("zh-CN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

export default function MortgagePage() {
  const { t } = useI18n();
  const [amount, setAmount] = useState(100);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(3.9);
  const [type, setType] = useState<"equal-payment" | "equal-principal">("equal-payment");

  const result = useMemo(() => {
    const principal = amount * 10000;
    const months = years * 12;
    const monthlyRate = rate / 100 / 12;

    if (monthlyRate === 0) {
      const payment = principal / months;
      const schedule: ScheduleRow[] = [];
      let remaining = principal;
      for (let m = 1; m <= months; m += 1) {
        schedule.push({
          month: m,
          payment,
          principal: payment,
          interest: 0,
          remaining: Math.max(0, remaining - payment),
        });
        remaining -= payment;
      }
      return {
        firstPayment: payment,
        monthlyPayment: payment,
        totalPayment: principal,
        totalInterest: 0,
        schedule,
      };
    }

    if (type === "equal-payment") {
      const factor = Math.pow(1 + monthlyRate, months);
      const payment = (principal * monthlyRate * factor) / (factor - 1);
      const totalPayment = payment * months;
      const totalInterest = totalPayment - principal;
      const schedule: ScheduleRow[] = [];
      let remaining = principal;
      for (let m = 1; m <= months; m += 1) {
        const interest = remaining * monthlyRate;
        const principalPaid = payment - interest;
        remaining -= principalPaid;
        schedule.push({
          month: m,
          payment,
          principal: principalPaid,
          interest,
          remaining: Math.max(0, remaining),
        });
      }
      return { firstPayment: payment, monthlyPayment: payment, totalPayment, totalInterest, schedule };
    }

    // Equal principal
    const monthlyPrincipal = principal / months;
    const schedule: ScheduleRow[] = [];
    let remaining = principal;
    let totalPayment = 0;
    for (let m = 1; m <= months; m += 1) {
      const interest = remaining * monthlyRate;
      const payment = monthlyPrincipal + interest;
      totalPayment += payment;
      remaining -= monthlyPrincipal;
      schedule.push({
        month: m,
        payment,
        principal: monthlyPrincipal,
        interest,
        remaining: Math.max(0, remaining),
      });
    }
    return {
      firstPayment: schedule[0]?.payment ?? 0,
      monthlyPayment: null,
      totalPayment,
      totalInterest: totalPayment - principal,
      schedule,
    };
  }, [amount, years, rate, type]);

  return (
    <ToolLayout maxWidth="max-w-5xl">
      <PageHeader title={t("mortgageTitle")} description={t("mortgageDesc")} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm lg:col-span-1">
          <div className="space-y-2">
            <Label htmlFor="mortgage-amount">{t("mortgageAmount")}</Label>
            <Input
              id="mortgage-amount"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mortgage-years">{t("mortgageYears")}</Label>
            <Input
              id="mortgage-years"
              type="number"
              min={1}
              max={30}
              value={years}
              onChange={(e) => setYears(Math.max(1, Math.min(30, Number(e.target.value))))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mortgage-rate">{t("mortgageRate")}</Label>
            <Input
              id="mortgage-rate"
              type="number"
              step={0.01}
              min={0}
              value={rate}
              onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("mortgageType")}</Label>
            <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equal-payment">{t("mortgageTypeEqualPayment")}</SelectItem>
                <SelectItem value="equal-principal">{t("mortgageTypeEqualPrincipal")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-card p-4 text-center shadow-sm">
              <p className="text-sm text-muted-foreground">
                {type === "equal-payment" ? t("mortgageMonthlyPayment") : `${t("mortgageMonthlyPayment")} (${t("mortgageMonth")} 1)`}
              </p>
              <p className="mt-1 text-2xl font-bold">¥{formatMoney(result.firstPayment)}</p>
            </div>
            <div className="rounded-lg border bg-card p-4 text-center shadow-sm">
              <p className="text-sm text-muted-foreground">{t("mortgageTotalInterest")}</p>
              <p className="mt-1 text-2xl font-bold">¥{formatMoney(result.totalInterest)}</p>
            </div>
            <div className="rounded-lg border bg-card p-4 text-center shadow-sm">
              <p className="text-sm text-muted-foreground">{t("mortgageTotalPayment")}</p>
              <p className="mt-1 text-2xl font-bold">¥{formatMoney(result.totalPayment)}</p>
            </div>
          </div>

          <Tabs defaultValue="schedule">
            <TabsList>
              <TabsTrigger value="schedule">
                <Calculator className="mr-2 h-4 w-4" />
                {t("mortgageSchedule")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="schedule" className="rounded-lg border bg-card shadow-sm">
              <ScrollArea className="h-[50vh]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left">{t("mortgageMonth")}</th>
                      <th className="px-4 py-2 text-right">{t("mortgagePrincipal")}</th>
                      <th className="px-4 py-2 text-right">{t("mortgageInterest")}</th>
                      <th className="px-4 py-2 text-right">{t("mortgageMonthlyPayment")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {result.schedule.map((row) => (
                      <tr key={row.month} className="even:bg-muted/50">
                        <td className="px-4 py-2">{row.month}</td>
                        <td className="px-4 py-2 text-right">¥{formatMoney(row.principal)}</td>
                        <td className="px-4 py-2 text-right">¥{formatMoney(row.interest)}</td>
                        <td className="px-4 py-2 text-right font-medium">¥{formatMoney(row.payment)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ToolLayout>
  );
}
