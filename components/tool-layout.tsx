import { cn } from "@/lib/utils";

export type ToolMaxWidth =
  | "max-w-3xl"
  | "max-w-4xl"
  | "max-w-5xl"
  | "max-w-6xl"
  | "max-w-7xl";

interface ToolLayoutProps {
  children: React.ReactNode;
  maxWidth?: ToolMaxWidth;
  className?: string;
}

export function ToolLayout({
  children,
  maxWidth = "max-w-5xl",
  className,
}: ToolLayoutProps) {
  return (
    <div
      className={cn(
        "mx-auto flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8",
        maxWidth,
        className
      )}
    >
      {children}
    </div>
  );
}
