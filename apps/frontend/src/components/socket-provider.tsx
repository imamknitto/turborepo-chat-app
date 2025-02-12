import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface ISocketContext {
  socket: Socket | null
}

const SocketContext = createContext<ISocketContext>({ socket: null })

export const useSocket = () => useContext(SocketContext)

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const socket = io('http://192.168.21.32:4006')
    setSocket(socket)

    return () => {
      socket.disconnect()
    }
  }, [])

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}

export default SocketProvider
