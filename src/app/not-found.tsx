'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'
 
export default function NotFound({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2>Something went wrong! - Page not found</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}