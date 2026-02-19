import { createContext, useContext } from 'react'

const PortalContainerContext = createContext(null)

export const PortalContainerProvider = PortalContainerContext.Provider

export function usePortalContainer() {
  return useContext(PortalContainerContext)
}
