export function LoadingChart() {
    return (
        <div className="flex flex-col space-y-25 w-full max-w-xl rounded-lg mx-auto">
            <div className="flex flex-col space-y-3 items-start">
                <div className="h-6 w-32 bg-blue-200 rounded animate-pulse"></div>
                <div className="h-28 w-full max-w-4xl bg-blue-200 rounded animate-pulse mx-auto"></div>
            </div>
            <div className="flex flex-col space-y-3 items-start">
                <div className="h-6 w-40 bg-blue-300 rounded animate-pulse"></div>
                <div className="flex gap-x-12 mt-2 mb-4">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center space-x-2">
                            <div className="h-4 w-4 bg-blue-300 rounded animate-pulse"></div>
                            <div className="h-4 w-16 bg-blue-300 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
                <div className="h-36 w-full max-w-4xl bg-blue-300 rounded animate-pulse mx-auto"></div>
            </div>
        </div>
    )
}
