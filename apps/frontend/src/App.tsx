import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { openToast } from '@/lib/utils'
import { ThemeToggle } from './components/apps/theme-toggle'
import { useSocket } from './components/socket-provider'
import UserForm from './components/apps/user-form'
import ChatBox from './components/apps/chat-box'
import IcChat from './components/icons/ic-chat'
import { Notifications } from 'react-push-notification'

const userId = localStorage.getItem('userId') || uuidv4()
localStorage.setItem('userId', userId)

export default function App() {
  const { socket } = useSocket()
  const [username, setUsername] = useState(localStorage.getItem('username') || '')

  useEffect(() => {
    socket?.on('usernameSet', () => openToast('Berhasil submit username'))
    socket?.on('usernameError', msg => openToast(msg))
    socket?.on('spamError', msg => openToast(msg))

    return () => {
      socket?.off('usernameSet')
      socket?.off('usernameError')
      socket?.off('spamError')
    }
  }, [socket])

  return (
    <div className='p-5 min-h-screen bg-white dark:bg-zinc-900 dark:text-white'>
      <div className='flex flex-row justify-between items-center'>
        <h1 className='flex'>
          <IcChat className='me-2 !size-8' />
          Chat.aja
        </h1>
        <ThemeToggle />
      </div>

      <div className='flex flex-col items-center mt-5'>
        {!userId || !username ? (
          <UserForm userId={userId} setUsername={setUsername} />
        ) : (
          <ChatBox userId={userId} />
        )}
      </div>
    </div>
  )
}
