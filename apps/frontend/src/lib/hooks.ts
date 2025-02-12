import { useEffect } from "react"

export function useOnClickOutside(
  ref: React.RefObject<HTMLDivElement | HTMLElement>,
  handler: (currentTarget?: HTMLElement | null, el?: HTMLDivElement | HTMLElement) => void,
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as HTMLDivElement)) return
      handler(event.target as HTMLElement, ref.current)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}
