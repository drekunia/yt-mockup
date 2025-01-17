import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

type SidebarProviderProps = {
  children: ReactNode
}

type SidebarContextType = {
  isLargeOpen: boolean
  isSmallOpen: boolean
  toggle: () => void
  close: () => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export function useSidebarContext() {
  const value = useContext(SidebarContext)
  if (value == null) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }

  return value
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isLargeOpen, setIsLargeOpen] = useState(true)
  const [isSmallOpen, setIsSmallOpen] = useState(false)

  function isScreenSmall() {
    return window.innerWidth < 1024
  }

  useEffect(() => {
    const handler = () => {
      if (!isScreenSmall()) setIsSmallOpen(false)
    }

    window.addEventListener("resize", handler)

    return () => {
      window.removeEventListener("resize", handler)
    }
  }, [])

  function toggle() {
    if (isScreenSmall()) {
      setIsSmallOpen(!isSmallOpen)
    } else {
      setIsLargeOpen(!isLargeOpen)
    }
  }

  function close() {
    if (isScreenSmall()) {
      setIsSmallOpen(false)
    } else {
      setIsLargeOpen(false)
    }
  }

  return (
    <SidebarContext.Provider
      value={{
        isLargeOpen,
        isSmallOpen,
        toggle,
        close,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}
