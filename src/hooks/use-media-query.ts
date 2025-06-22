import * as React from "react"

/**
 * A React Hook that tracks the state of a media query.
 *
 * @param query The media query to track.
 * @returns `true` if the media query matches, otherwise `false`.
 *
 * @example
 * ```tsx
 * const isLg = useMediaQuery("(min-width: 1024px)")
 *
 * if (isLg) {
 *  // Do something for large screens
 * }
 * ```
 */
export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false)

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }

    const result = window.matchMedia(query)
    result.addEventListener("change", onChange)
    setValue(result.matches)

    return () => result.removeEventListener("change", onChange)
  }, [query])

  return value
} 