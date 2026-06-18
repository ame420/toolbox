"use client";

import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export interface FileDropZoneProps {
  accept?: string;
  maxSize?: number; // bytes
  onFile: (file: File) => void;
  onError?: (message: string) => void;
  className?: string;
}

export function FileDropZone({
  accept = "image/*",
  maxSize = 2 * 1024 * 1024,
  onFile,
  onError,
  className,
}: FileDropZoneProps) {
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const validate = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        onError?.(t("dropzoneNotImage"));
        return false;
      }
      if (file.size > maxSize) {
        onError?.(t("dropzoneTooLarge", { size: Math.round(maxSize / 1024 / 1024) }));
        return false;
      }
      return true;
    },
    [maxSize, onError, t]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (validate(file)) {
        setFileName(file.name);
        onFile(file);
      }
    },
    [onFile, validate]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clear = () => {
    setFileName(null);
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50",
        className
      )}
    >
      <input
        type="file"
        accept={accept}
        onChange={onInputChange}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
      <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
      <p className="text-sm font-medium">
        {isDragging ? t("dropzoneDrag") : t("dropzoneClick")}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {t("dropzoneSupport", { size: Math.round(maxSize / 1024 / 1024) })}
      </p>
      {fileName && (
        <div className="mt-3 flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
          <span className="max-w-[200px] truncate">{fileName}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-4 w-4"
            onClick={(e) => {
              e.stopPropagation();
              clear();
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
