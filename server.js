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
app.use(express.static(path.join(__dirname, 'public/views/')))
app.set('views', path.join(__dirname, 'public/views/'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})