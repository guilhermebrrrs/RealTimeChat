const socket = io()
const messages = document.querySelector('.messages')
const sendButton = document.querySelector('.send-button')
const messageBox = document.querySelector('input[name="message-box"]')
const userName = document.querySelector('span.user-name')
const roomId = document.querySelector('span.room-id')

const queryString = location.search.slice(1)
const queryStringParts = queryString.split('&')
const userData = {}

function renderOwnerMessage(message) {
  const divMessage = document.createElement('div')

  divMessage.classList.add('owner-message')
  divMessage.innerHTML = `<span class="message-user-name">${message.userName}</span><p class="user-message">${message.message}</p><span class="message-time">${message.messageTime}</span>`
  messages.appendChild(divMessage)

  messageBox.value = ''
}

function renderReceivedMessage(message) {
  const divMessage = document.createElement('div')

  divMessage.classList.add('received-message')
  divMessage.innerHTML = `<span class="message-user-name">${message.userName}</span><p class="user-message">${message.message}</p><span class="message-time">${message.messageTime}</span>`
  messages.appendChild(divMessage)

  messageBox.value = ''
}

function renderWelcomeMessage(socketId, userName) {
  if (socketId === socket.id) {
    const divMessage = document.createElement('div')

    divMessage.classList.add('welcome')
    divMessage.innerHTML = `••• Bem-vindo a sala •••</span>`
    messages.appendChild(divMessage)
  }
  if (socketId !== socket.id) {
    const divMessage = document.createElement('div')

    divMessage.classList.add('welcome-new-user')
    divMessage.innerHTML = `••• <span>${userName}</span> entrou na sala •••`
    messages.appendChild(divMessage)    
  }
}

queryStringParts.forEach((part) => {
  const keyValue = part.split('=')
  const key = keyValue[0]
  const value = keyValue[1].split('+').join(' ')
  userData[decodeURIComponent(key)] = decodeURIComponent(value)
})

userName.innerHTML = userData.username
roomId.innerHTML = userData.roomid

sendButton.addEventListener('click', () => {
  const messageObject = {
    userSocket: socket.id,
    userName: userData.username,
    roomId: userData.roomid,
    message: messageBox.value,
    messageTime: new Date()
  }

  socket.emit('chatMessage', messageObject)
})

messageBox.addEventListener('submit', (event) => {
  event.preventDefault()

  const messageObject = {
    userSocket: socket.id,
    userName: userName.value,
    roomId: roomId.value,
    message: messageBox.value,
    messageTime: new Date()
  }

  socket.emit('chatMessage', messageObject)
})

socket.emit('joinRoom', userData)

socket.on('welcomeMessage', (user) => {
  renderWelcomeMessage(user.id, user.username)
})

socket.on('message', (messageObject) => {
  if (messageObject.userSocket === socket.id) {
    renderOwnerMessage(messageObject)
    console.log('owner', messageObject)
  }
  if (messageObject.userSocket !== socket.id) {
    renderReceivedMessage(messageObject)
    console.log('received', messageObject)
  }
})

socket.on('userDisconnects', (user) => {
  const divMessage = document.createElement('div')

    divMessage.classList.add('user-disconnects')
    divMessage.innerHTML = `••• ${user.username} saiu da sala •••</span>`
    messages.appendChild(divMessage)
})