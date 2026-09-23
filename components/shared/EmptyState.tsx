import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    actionHref,
    onAction
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[320px] animate-in fade-in zoom-in duration-500 ">
            <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                {Icon ? (
                    <Icon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">
                {description}
            </p>

            {actionHref ? (
                <Button asChild>
                    <Link href={actionHref}>
                        {actionLabel}
                    </Link>
                </Button>
            ) : onAction ? (
                <Button onClick={onAction}>
                    {actionLabel}
                </Button>
            ) : null}
        </div>
    );
}