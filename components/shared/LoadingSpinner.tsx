
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-zinc-200/80 shadow-2xs">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <span className="text-sm text-zinc-500">{title}</span>
        </div>
    );
}