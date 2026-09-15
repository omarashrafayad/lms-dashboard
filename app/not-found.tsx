
import Link from 'next/link';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-5">
                        <span className="text-9xl font-black text-gray-900 dark:text-white select-none">404</span>
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                            <FileQuestion className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
                            Page Not Found
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                            Sorry, we couldnt find the page youre looking for. It might have been moved or deleted.
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg transition-all shadow-sm hover:shadow-md"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>
                    <Link
                        href="/contact"
                        className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-zinc-700 text-base font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 md:py-4 md:text-lg transition-all"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
