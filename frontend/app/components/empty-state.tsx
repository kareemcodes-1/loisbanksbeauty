import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  buttonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
}

const EmptyState = ({
  icon: Icon,
  message,
  buttonText,
  buttonHref,
  onButtonClick,
}: EmptyStateProps) => {
  const showButton = Boolean(buttonText && (buttonHref || onButtonClick));

  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 px-4 text-center sm:gap-5 sm:px-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white shadow-sm sm:h-14 sm:w-14">
        <Icon
          size={25}
          strokeWidth={1.6}
          className="text-[#FD3F92]"
        />
      </div>

      <p className="max-w-[18rem] text-[1rem] lg:text-[1.4rem] leading-relaxed text-black/70 sm:text-base">
        {message}
      </p>

      {showButton &&
        (buttonHref ? (
          <Link href={buttonHref} className="btn-primary">
            {buttonText}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onButtonClick}
            className="btn-primary"
          >
            {buttonText}
          </button>
        ))}
    </div>
  );
};

export default EmptyState;

