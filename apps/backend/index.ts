import express, { Express, Request, Response } from 'express'
import { Server } from 'socket.io'
import { createServer } from 'node:http'

const app: Express = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: '*',
  },
})

// In-memory storage for connected users
const users = new Map()
const sockets = new Map()

// Rate limiting configuration
const MESSAGE_LIMIT = 5
const TIME_WINDOW = 10 * 1000
const userMessageCounts = new Map()

function normalizeUsername(username: string) {
  return username.trim().toLowerCase()
}

io.on('connection', socket => {
  // Handle user registration
  socket.on('registerUser', ({ userId, username }) => {
    const normalizedUsername = normalizeUsername(username)

    if (!username || [...users.values()].includes(normalizedUsername)) {
      socket.emit('usernameError', 'Username kamu gak valid atau udah ada yang pake!')
      return
    }

    // Associate userId with username
    users.set(userId, username)
    sockets.set(socket.id, userId)

    // Notify other users
    socket.broadcast.emit('userJoined', `${username} telah bergabung.`)
    socket.emit('usernameSet', username)
  })

  // Listen for new messages
  socket.on('sendMessage', (message: string, userId: string) => {
    const username = users.get(userId)

    // Check rate limit
    if (!userMessageCounts.has(userId)) {
      userMessageCounts.set(userId, [])
    }
    const timestamps = userMessageCounts.get(userId)
    const now = Date.now()
    const recentMessages = timestamps.filter((time: number) => now - time < TIME_WINDOW)

    if (recentMessages.length >= MESSAGE_LIMIT) {
      socket.emit('spamError', 'Oi caper, Jangan spam biar asik!!')
      return
    }

    // Add timestamp to message count
    timestamps.push(now)
    userMessageCounts.set(userId, timestamps)

    // Broadcast the message
    io.emit('newMessage', { userId, username, message })
  })

  socket.on('exit', userId => {
    if (userId) {
      const username = users.get(userId)

      if (username) {
        socket.broadcast.emit('userLeft', `${username} meninggalkan chat.`)
      }

      // Clean up the maps
      users.delete(userId)
      sockets.delete(socket.id)
    }
  })
})

app.get('/', (req: Request, res: Response) => {
  res.send('Hi there!')
})

server.listen(4006, () => {
  console.log(`[server]: Server is running at http://localhost:4006`)
})
