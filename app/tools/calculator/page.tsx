"use client";

import { useCallback, useEffect, useState } from "react";
import { Delete, Percent } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

type Operator = "+" | "-" | "×" | "÷";

function calculate(left: number, op: Operator, right: number): number {
  switch (op) {
    case "+": return left + right;
    case "-": return left - right;
    case "×": return left * right;
    case "÷": return right !== 0 ? left / right : NaN;
  }
}

function formatDisplay(n: number): string {
  if (Number.isNaN(n)) return "Error";
  if (n === Infinity || n === -Infinity) return "Error";
  const str = String(n);
  if (str.length > 14) {
    return n.toExponential(6);
  }
  return str;
}

export default function CalculatorPage() {
  const { t } = useI18n();
  const [display, setDisplay] = useState("0");
  const [left, setLeft] = useState<number | null>(null);
  const [op, setOp] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState("");

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay((prev) => (prev === "0" ? digit : prev + digit));
    }
  }, [waitingForOperand]);

  const inputDot = useCallback(() => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    setDisplay((prev) => (prev.includes(".") ? prev : prev + "."));
  }, [waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay("0");
    setLeft(null);
    setOp(null);
    setWaitingForOperand(false);
    setExpression("");
  }, []);

  const backspace = useCallback(() => {
    if (waitingForOperand) return;
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  }, [waitingForOperand]);

  const toggleSign = useCallback(() => {
    if (display === "0") return;
    setDisplay((prev) => (prev.startsWith("-") ? prev.slice(1) : "-" + prev));
  }, [display]);

  const percent = useCallback(() => {
    const val = parseFloat(display);
    if (Number.isNaN(val)) return;
    setDisplay(String(val / 100));
  }, [display]);

  const performOp = useCallback((nextOp: Operator | null) => {
    const current = parseFloat(display);
    if (Number.isNaN(current)) return;

    if (left === null) {
      setLeft(current);
    } else if (op !== null) {
      const result = calculate(left!, op, current);
      setDisplay(formatDisplay(result));
      setLeft(result);
    }
    setOp(nextOp);
    setWaitingForOperand(true);
    if (nextOp) {
      setExpression(`${formatDisplay(left ?? current)} ${nextOp}`);
    } else {
      setExpression("");
    }
  }, [display, left, op]);

  const equals = useCallback(() => {
    const current = parseFloat(display);
    if (Number.isNaN(current)) return;

    if (left !== null && op !== null) {
      const result = calculate(left, op, current);
      setDisplay(formatDisplay(result));
      setExpression(`${formatDisplay(left)} ${op} ${formatDisplay(current)} =`);
      setLeft(result);
      setOp(null);
      setWaitingForOperand(true);
    } else {
      setExpression(`${formatDisplay(current)} =`);
    }
  }, [display, left, op]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key >= "0" && e.key <= "9") {
      inputDigit(e.key);
    } else if (e.key === ".") {
      inputDot();
    } else if (e.key === "+") {
      performOp("+");
    } else if (e.key === "-") {
      performOp("-");
    } else if (e.key === "*") {
      performOp("×");
    } else if (e.key === "/") {
      e.preventDefault();
      performOp("÷");
    } else if (e.key === "Enter" || e.key === "=") {
      equals();
    } else if (e.key === "Escape") {
      clear();
    } else if (e.key === "Backspace") {
      backspace();
    } else if (e.key === "%") {
      percent();
    }
  }, [inputDigit, inputDot, performOp, equals, clear, backspace, percent]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const btnClass = "h-14 text-lg font-semibold";
  const opBtnClass = "h-14 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90";
  const eqBtnClass = "h-14 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90";
  const funcBtnClass = "h-14 text-lg font-semibold bg-muted text-muted-foreground hover:bg-accent";

  return (
    <ToolLayout maxWidth="max-w-3xl">
      <PageHeader
        title={t("calculatorTitle")}
        description={t("calculatorDesc")}
      />

      <div className="mx-auto w-full max-w-sm rounded-xl border bg-card p-4 shadow-lg">
        <div className="mb-3 min-h-[3.5rem] text-right text-sm text-muted-foreground break-all">
          {expression || "\u00A0"}
        </div>
        <div
          className="mb-4 overflow-hidden text-right text-3xl font-bold tracking-tight tabular-nums"
          aria-label={t("calculatorDisplay")}
        >
          {display}
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Button className={funcBtnClass} onClick={clear}>C</Button>
          <Button className={funcBtnClass} onClick={backspace}>
            <Delete className="h-5 w-5" />
          </Button>
          <Button className={funcBtnClass} onClick={percent}>
            <Percent className="h-5 w-5" />
          </Button>
          <Button className={opBtnClass} onClick={() => performOp("÷")}>÷</Button>

          <Button className={btnClass} onClick={() => inputDigit("7")}>7</Button>
          <Button className={btnClass} onClick={() => inputDigit("8")}>8</Button>
          <Button className={btnClass} onClick={() => inputDigit("9")}>9</Button>
          <Button className={opBtnClass} onClick={() => performOp("×")}>×</Button>

          <Button className={btnClass} onClick={() => inputDigit("4")}>4</Button>
          <Button className={btnClass} onClick={() => inputDigit("5")}>5</Button>
          <Button className={btnClass} onClick={() => inputDigit("6")}>6</Button>
          <Button className={opBtnClass} onClick={() => performOp("-")}>-</Button>

          <Button className={btnClass} onClick={() => inputDigit("1")}>1</Button>
          <Button className={btnClass} onClick={() => inputDigit("2")}>2</Button>
          <Button className={btnClass} onClick={() => inputDigit("3")}>3</Button>
          <Button className={opBtnClass} onClick={() => performOp("+")}>+</Button>

          <Button className={funcBtnClass} onClick={toggleSign}>
            +/−
          </Button>
          <Button className={btnClass} onClick={() => inputDigit("0")}>0</Button>
          <Button className={btnClass} onClick={inputDot}>.</Button>
          <Button className={eqBtnClass} onClick={equals}>=</Button>
        </div>
      </div>
    </ToolLayout>
  );
}
