const socket = io()
const messages = document.querySelector('.messages')
const sendButton = document.querySelector('.send-button')
const messageBox = document.querySelector('input[name="message-box"]')
const userName = document.querySelector('span.user-name')
const roomId = document.querySelector('span.room-id')

const queryString = location.search.slice(1)
const queryStringParts = queryString.split('&')
const userData = {}

queryStringParts.forEach((part) => {
  const keyValue = part.split('=')
  const key = keyValue[0]
  const value = keyValue[1].split('+').join(' ')
  userData[decodeURIComponent(key)] = decodeURIComponent(value)
})

userName.innerHTML = userData.username
roomId.innerHTML = userData.roomid

function renderOwnerMessage(message) {
  const divMessage = document.createElement('div')

  divMessage.classList.add('owner-message')
  divMessage.innerHTML = `<span class="message-user-name">${message.userName}</span><p class="user-message">${message.message}</p><span class="message-time">${message.messageHours + ':' + message.messageMinutes}</span>`
  messages.appendChild(divMessage)
}

function renderReceivedMessage(message) {
  const divMessage = document.createElement('div')

  divMessage.classList.add('received-message')
  divMessage.innerHTML = `<span class="message-user-name">${message.userName}</span><p class="user-message">${message.message}</p><span class="message-time">${message.messageHours + ':' + message.messageMinutes}</span>`
  messages.appendChild(divMessage)
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



sendButton.addEventListener('click', () => {
  if (messageBox.value) {
    const time = new Date()

    const messageObject = {
      userSocket: socket.id,
      userName: userData.username,
      roomId: userData.roomid,
      message: messageBox.value,
      messageTime: time,
      messageHours: time.getHours(),
      messageMinutes: time.getMinutes()
    }

    socket.emit('chatMessage', messageObject)
    messageBox.value = ''
  }
})

messageBox.addEventListener('keydown', (event) => {
  if (event.key == 'Enter') {
    if (messageBox.value) {
      const time = new Date()

      const messageObject = {
        userSocket: socket.id,
        userName: userData.username,
        roomId: userData.roomid,
        message: messageBox.value,
        messageTime: time,
        messageHours: time.getHours(),
        messageMinutes: time.getMinutes()
      }

      socket.emit('chatMessage', messageObject)
      messageBox.value = ''
    }
  }
})

socket.emit('joinRoom', userData)

socket.on('welcomeMessage', (user) => {
  renderWelcomeMessage(user.id, user.username)
})

socket.on('message', (messageObject) => {
  if (messageObject.userSocket === socket.id) {
    renderOwnerMessage(messageObject)
  }
  if (messageObject.userSocket !== socket.id) {
    renderReceivedMessage(messageObject)
  }
})

socket.on('userDisconnects', (user) => {
  const divMessage = document.createElement('div')

  divMessage.classList.add('user-disconnects')
  divMessage.innerHTML = `••• ${user.username} saiu da sala •••</span>`
  messages.appendChild(divMessage)
})