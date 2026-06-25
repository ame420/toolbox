"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

const API_KEY = "toolbox-roan-iota.vercel.app";
const API_NAMESPACE = "visits";

export function VisitorCounter() {
  const { t } = useI18n();
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`https://api.countapi.xyz/hit/${API_KEY}/${API_NAMESPACE}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => setCount(data.value))
      .catch(() => setError(true));
  }, []);

  if (error) return null;

  return (
    <span className="text-xs text-muted-foreground">
      {t("visitorCount")}{count !== null ? count.toLocaleString() : "..."}{t("visitorUnit")}
    </span>
  );
}
