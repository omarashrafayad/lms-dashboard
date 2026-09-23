"use client";

import { AlertTriangle } from "lucide-react";

export default function GlobalError() {
    return (

        <main className="m flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
            <div className="max-w-md w-full text-center space-y-6">

                {/* Warning Icon Badge */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 ring-8 ring-red-50 dark:ring-red-950/20 shadow-sm">
                    <AlertTriangle className="w-8 h-8 stroke-[2.25]" />
                </div>

                {/* Error Copy */}
                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                        Something went wrong
                    </h1>
                    <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                        An unexpected system error occurred. You can retry the action or return to safety.
                    </p>
                </div>

            </div>
        </main>
    );
}