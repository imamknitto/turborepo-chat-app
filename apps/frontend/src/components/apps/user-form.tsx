import { useState } from 'react'
import { useSocket } from '@/components/socket-provider'
import { openToast } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface IUserFormProps {
  setUsername: React.Dispatch<React.SetStateAction<string>>
  userId: string
}

export default function UserForm({ setUsername, userId }: IUserFormProps) {
  const { socket } = useSocket()
  const [inputUsername, setInputUsername] = useState('')

  const handleSetUsername = () => {
    if (!inputUsername.trim()) {
      openToast('Jangan kosong username nya!')
      return
    }

    // Emit the username to the server for validation
    socket?.emit('registerUser', { userId, username: inputUsername.substring(0, 10) })

    // Listen for server response
    socket?.once('usernameSet', () => {
      setUsername(inputUsername)
      localStorage.setItem('username', inputUsername)
    })

    socket?.once('usernameError', msg => openToast(msg))
  }

  return (
    <div>
      <Input
        placeholder='Isi username dulu...'
        value={inputUsername}
        maxLength={10}
        onChange={e => setInputUsername(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) handleSetUsername()
        }}
      />
      <Button onClick={handleSetUsername} className='mt-2.5'>
        Submit
      </Button>
    </div>
  )
}
