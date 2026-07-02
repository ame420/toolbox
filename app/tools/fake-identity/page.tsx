"use client";

import { useState } from "react";
import { Copy, RefreshCw, User } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { generateFakeIdentity, type FakeIdentity } from "@/lib/fake-identity";

export default function FakeIdentityPage() {
  const { t } = useI18n();
  const [identity, setIdentity] = useState<FakeIdentity | null>(null);

  const handleGenerate = () => {
    setIdentity(generateFakeIdentity(t as (key: string) => string));
  };

  const copyValue = async (value: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(t("copied"));
  };

  const handleCopyAll = async () => {
    if (!identity) return;
    const lines = [
      `${t("fakeIdentityName")}: ${identity.name}`,
      `${t("fakeIdentityGender")}: ${identity.gender}`,
      `${t("fakeIdentityIdCard")}: ${identity.idCard}`,
      `${t("fakeIdentityPhone")}: ${identity.phone}`,
      `${t("fakeIdentityEmail")}: ${identity.email}`,
      `${t("fakeIdentityAddress")}: ${identity.address}`,
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    toast.success(t("copied"));
  };

  const fields: { key: keyof FakeIdentity; labelKey: string }[] = [
    { key: "name", labelKey: "fakeIdentityName" },
    { key: "gender", labelKey: "fakeIdentityGender" },
    { key: "idCard", labelKey: "fakeIdentityIdCard" },
    { key: "phone", labelKey: "fakeIdentityPhone" },
    { key: "email", labelKey: "fakeIdentityEmail" },
    { key: "address", labelKey: "fakeIdentityAddress" },
  ];

  return (
    <ToolLayout maxWidth="max-w-3xl">
      <PageHeader title={t("fakeIdentityTitle")} description={t("fakeIdentityDesc")} />

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleGenerate}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("fakeIdentityGenerate")}
          </Button>
          <Button variant="outline" onClick={handleCopyAll} disabled={!identity}>
            <Copy className="mr-2 h-4 w-4" />
            {t("fakeIdentityCopyAll")}
          </Button>
        </div>

        {identity && (
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="flex items-center gap-3 border-b p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold">{identity.name}</p>
                <p className="text-sm text-muted-foreground">{identity.gender}</p>
              </div>
            </div>

            <div className="divide-y">
              {fields.map(({ key, labelKey }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => copyValue(identity[key])}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">{t(labelKey as never)}</p>
                    <p className="truncate font-mono text-sm">{identity[key]}</p>
                  </div>
                  <Copy className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
