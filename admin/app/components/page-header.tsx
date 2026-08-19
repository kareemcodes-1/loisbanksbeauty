import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Title + Description */}
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
          {title}
        </h1>

        {description && (
          <p className="max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* Action */}
      {action && (
        <div className="flex w-full shrink-0 items-center sm:w-auto">
          <div className="w-full sm:w-auto">
            {action}
          </div>
        </div>
      )}
    </div>
  );
}