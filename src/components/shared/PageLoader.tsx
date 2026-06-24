import React from 'react'

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col gap-4">
        <div className="h-48 w-full animate-shimmer rounded-xl" />
        <div className="h-6 w-3/4 animate-shimmer rounded" />
        <div className="h-4 w-1/2 animate-shimmer rounded" />
        <div className="flex gap-2">
          <div className="h-10 w-24 animate-shimmer rounded-lg" />
          <div className="h-10 w-24 animate-shimmer rounded-lg" />
        </div>
      </div>
    </div>
  )
}
