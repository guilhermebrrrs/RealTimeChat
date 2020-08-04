const express = require('express')
const http = require('http')
const SocketIO = require('socket.io')
const routes = require('./routes')
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = SocketIO(server)

const PORT = 3000 || process.env.PORT

app.use(routes)
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')


io.on('connection', (socket) => {
  const user = {}

  socket.on('joinRoom', (userData) => {
    user.username = userData.username,
    user.id = socket.id
    user.roomid = userData.roomid
    
    socket.join(user.roomid)

    io.to(user.roomid).emit('welcomeMessage', user)
  })

  socket.on('chatMessage', messageObject => {
    io.to(messageObject.roomId).emit('message', messageObject)
  })

  socket.on('disconnect', () => {
    io.to(user.roomid).emit('userDisconnects', user)
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})