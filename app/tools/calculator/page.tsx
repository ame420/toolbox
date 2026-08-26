"use client";

import { useCallback, useMemo, useState, type KeyboardEvent } from "react";
import { Copy, Delete, Percent } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

// 安全表达式求值：递归下降解析，支持 + - × ÷ * / % ( ) 与一元负号，不使用 eval
function evaluate(expr: string): number {
  let i = 0;
  const s = expr;
  const fail = (): never => {
    throw new Error("invalid expression");
  };

  const parseNumber = (): number => {
    let num = "";
    let hasDot = false;
    while (i < s.length && /[0-9.]/.test(s[i])) {
      if (s[i] === ".") {
        if (hasDot) fail();
        hasDot = true;
      }
      num += s[i];
      i++;
    }
    if (num === "" || num === ".") fail();
    return parseFloat(num);
  };

  const parsePrimary = (): number => {
    if (s[i] === "(") {
      i++;
      const v = parseExpr();
      if (i >= s.length || s[i] !== ")") fail();
      i++;
      return v;
    }
    let v = parseNumber();
    if (s[i] === "%") {
      i++;
      v = v / 100;
    }
    return v;
  };

  const parseUnary = (): number => {
    if (s[i] === "-") {
      i++;
      return -parseUnary();
    }
    if (s[i] === "+") {
      i++;
      return parseUnary();
    }
    return parsePrimary();
  };

  const parseTerm = (): number => {
    let v = parseUnary();
    for (;;) {
      const c = s[i];
      if (c === "×" || c === "*") {
        i++;
        v *= parseUnary();
      } else if (c === "÷" || c === "/") {
        i++;
        const r = parseUnary();
        if (r === 0) return NaN;
        v /= r;
      } else {
        break;
      }
    }
    return v;
  };

  const parseExpr = (): number => {
    let v = parseTerm();
    for (;;) {
      const c = s[i];
      if (c === "+") {
        i++;
        v += parseTerm();
      } else if (c === "-") {
        i++;
        v -= parseTerm();
      } else {
        break;
      }
    }
    return v;
  };

  const result = parseExpr();
  if (i !== s.length) fail();
  return result;
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
  const [expr, setExpr] = useState("");
  const [forceError, setForceError] = useState(false);

  // 派生结果：输入变化时实时计算，表达式不完整时为空
  const display = useMemo(() => {
    if (forceError) return "Error";
    try {
      return formatDisplay(evaluate(expr));
    } catch {
      return null;
    }
  }, [expr, forceError]);

  const applyToExpr = useCallback((fn: (prev: string) => string) => {
    setForceError(false);
    setExpr((prev) => fn(prev));
  }, []);

  const handleChange = (raw: string) => {
    // 中文输入法输入的全角句号当作小数点
    applyToExpr(() => raw.replace(/。/g, "."));
  };

  const equals = useCallback(() => {
    if (!expr.trim()) {
      setForceError(false);
      return;
    }
    try {
      formatDisplay(evaluate(expr));
      setForceError(false);
    } catch {
      setForceError(true);
    }
  }, [expr]);

  const clear = useCallback(() => {
    setExpr("");
    setForceError(false);
  }, []);

  const backspace = useCallback(() => {
    applyToExpr((prev) => prev.slice(0, -1));
  }, [applyToExpr]);

  const inputDigit = useCallback(
    (digit: string) => {
      applyToExpr((prev) => prev + digit);
    },
    [applyToExpr]
  );

  const inputDot = useCallback(() => {
    applyToExpr((prev) => {
      const m = prev.match(/\d+(\.\d*)?$/);
      if (m) return m[0].includes(".") ? prev : prev + ".";
      return prev ? prev + "0." : "0.";
    });
  }, [applyToExpr]);

  const appendOp = useCallback(
    (op: string) => {
      // 末尾已有运算符时替换，避免出现 "1+-" 这类输入
      applyToExpr((prev) => prev.replace(/[+\-×÷*/]+$/, "") + op);
    },
    [applyToExpr]
  );

  const percent = useCallback(() => {
    applyToExpr((prev) => prev + "%");
  }, [applyToExpr]);

  const toggleSign = useCallback(() => {
    applyToExpr((prev) => {
      const m = prev.match(/(-?\d+(?:\.\d*)?%?)$/);
      if (!m) return prev ? prev + "-" : "-";
      const num = m[1];
      const signed = num.startsWith("-") ? num.slice(1) : "-" + num;
      return prev.slice(0, m.index) + signed;
    });
  }, [applyToExpr]);

  const handleCopy = async () => {
    if (!display || display === "Error") return;
    await navigator.clipboard.writeText(display);
    toast.success(t("copied"));
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "=") {
      e.preventDefault();
      equals();
    } else if (e.key === "Escape") {
      e.preventDefault();
      clear();
    }
  };

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
        <Input
          value={expr}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={t("calculatorInputPlaceholder")}
          aria-label={t("calculatorDisplay")}
          autoComplete="off"
          spellCheck={false}
          className="mb-3 h-12 text-right text-xl font-semibold tabular-nums"
        />

        <div className="mb-4 flex items-center justify-between gap-3">
          <div
            className="min-h-[2.25rem] flex-1 overflow-hidden text-right text-3xl font-bold tracking-tight tabular-nums break-all"
            aria-label={t("calculatorDisplay")}
          >
            {display ?? "\u00A0"}
          </div>
          <Button variant="outline" size="icon" onClick={handleCopy} disabled={!display || display === "Error"}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Button className={funcBtnClass} onClick={clear}>C</Button>
          <Button className={funcBtnClass} onClick={backspace}>
            <Delete className="h-5 w-5" />
          </Button>
          <Button className={funcBtnClass} onClick={percent}>
            <Percent className="h-5 w-5" />
          </Button>
          <Button className={opBtnClass} onClick={() => appendOp("÷")}>÷</Button>

          <Button className={btnClass} onClick={() => inputDigit("7")}>7</Button>
          <Button className={btnClass} onClick={() => inputDigit("8")}>8</Button>
          <Button className={btnClass} onClick={() => inputDigit("9")}>9</Button>
          <Button className={opBtnClass} onClick={() => appendOp("×")}>×</Button>

          <Button className={btnClass} onClick={() => inputDigit("4")}>4</Button>
          <Button className={btnClass} onClick={() => inputDigit("5")}>5</Button>
          <Button className={btnClass} onClick={() => inputDigit("6")}>6</Button>
          <Button className={opBtnClass} onClick={() => appendOp("-")}>-</Button>

          <Button className={btnClass} onClick={() => inputDigit("1")}>1</Button>
          <Button className={btnClass} onClick={() => inputDigit("2")}>2</Button>
          <Button className={btnClass} onClick={() => inputDigit("3")}>3</Button>
          <Button className={opBtnClass} onClick={() => appendOp("+")}>+</Button>

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