import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import EmojiPicker, { Theme } from 'emoji-picker-react'

import { openToast } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useSocket } from '@/components/socket-provider'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import IcExit from '@/components/icons/ic-exit'
import { Card } from '@/components/ui/card'
import IcEmoji from '../icons/ic-emoji'
import { useOnClickOutside } from '@/lib/hooks'
import { useTheme } from '../theme-provider'

interface IChatBoxProps {
  userId: string
}

export default function ChatBox({ userId }: IChatBoxProps) {
  const { socket } = useSocket()
  const { theme } = useTheme()

  const chatRef = useRef<HTMLDivElement>(null)
  const emojiRef = useRef<any>(null)
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  useOnClickOutside(emojiRef, () => {
    setShowEmojiPicker(false)
  })

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    socket?.on('newMessage', data => {
      if (!data?.username?.length) {
        localStorage.removeItem('username')
        localStorage.removeItem('userId')
        window.location.reload()
        return
      }
      setMessages(prev => [...prev, data])
    })

    socket?.on('userJoined', msg => {
      setMessages(prev => [...prev, { system: true, message: msg }])
    })

    socket?.on('userLeft', msg => {
      setMessages(prev => [...prev, { system: true, message: msg }])
    })

    return () => {
      socket?.off('newMessage')
      socket?.off('userJoined')
      socket?.off('userLeft')
    }
  }, [socket])

  const handleEmojiClick = (emojiObject: any) => {
    const { emoji } = emojiObject
    setInputMessage(prevMessage => prevMessage + emoji)
    setShowEmojiPicker(false)
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return openToast('Isi dulu pesan nya ya!')
    socket?.emit('sendMessage', inputMessage, userId)
    setInputMessage('')
  }

  const handleExit = () => {
    if (!userId) {
      window.location.reload()
      return
    }

    socket?.emit('exit', userId)
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
    window.location.reload()
  }

  const showNotification = () => {
    // Check if the browser supports notifications
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications')
      return
    }

    // If permission is granted, show the notification
    if (Notification.permission === 'granted') {
      displayNotification()
    } else if (Notification.permission !== 'denied') {
      // Otherwise, ask the user for permission
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          displayNotification()
        }
      })
    }
  }

  // Function to display the notification
  const displayNotification = () => {
    const notification = new Notification('Chat.aja', {
      body: 'This is a notification from your React app!',
    })

    notification.onclick = () => {}
  }

  return (
    <Card className='w-full max-w-lg p-4'>
      <div ref={chatRef} className='h-[calc(100vh-20rem)] overflow-y-auto mb-4'>
        {messages.map((msg, index) => (
          <div key={index} className={clsx('mb-2')}>
            {msg.system ? (
              <p className='text-gray-500 dark:text-white text-center text-sm'>{msg.message}</p>
            ) : (
              <Card
                className={clsx(
                  'w-max max-w-md p-2 flex flex-col text-sm',
                  msg.userId === userId && 'ml-auto',
                )}
              >
                <p className='font-semibold'>{msg.username}</p>
                <p className='text-gray-700 dark:text-gray-200'>{msg.message}</p>
              </Card>
            )}
          </div>
        ))}
      </div>
      <div className='flex flex-col gap-2'>
        <Textarea
          placeholder='Ketik pesan disini...'
          value={inputMessage}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          onChange={e => setInputMessage(e.target.value)}
        />
        <div className='flex gap-2 justify-between items-center'>
          <div className='flex items-center space-x-2'>
            <Button onClick={handleSendMessage}>Kirim</Button>
            <Button
              variant={'ghost'}
              className='!px-2'
              onClick={e => {
                e.stopPropagation()
                setShowEmojiPicker(true)
              }}
            >
              <IcEmoji className='!size-5' />
            </Button>

            <div ref={emojiRef} className='relative'>
              <div
                className={clsx(
                  'absolute bottom-full mb-6 -left-10 z-10',
                  showEmojiPicker ? 'block' : 'hidden',
                )}
              >
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme={theme as Theme}
                  open={showEmojiPicker}
                />
              </div>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={'ghost'} className='hover:!bg-transparent' onClick={handleExit}>
                  <IcExit className='ml-2 !size-6' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Keluar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  )
}
