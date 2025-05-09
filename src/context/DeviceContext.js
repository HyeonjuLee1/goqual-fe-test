import { createContext, useContext } from 'react'

export const DeviceContext = createContext({ deviceId: 'not-set' })

export const useDevice = () => useContext(DeviceContext)
