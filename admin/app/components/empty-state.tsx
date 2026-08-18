import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Empty className="border">
      {icon && (
        <EmptyMedia variant="icon">
          {icon}
        </EmptyMedia>
      )}

      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>

        {description && (
          <EmptyDescription>
            {description}
          </EmptyDescription>
        )}
      </EmptyHeader>

      {action && (
        <EmptyContent>
          {action}
        </EmptyContent>
      )}
    </Empty>
  );
}