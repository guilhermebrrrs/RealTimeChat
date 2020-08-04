const sendButton = document.querySelector('a.send-button')

const socket = io()

sendButton.addEventListener('click', () => {
  const username = document.querySelector('input[name="username"]').value
  const roomid = document.querySelector('input[name="roomid"]').value

  if (!username || !roomid) {
    alert(`É necessário preencher os campos "NOME DE USUÀRIO" e "CÓDIGO DA SALA"`)
  } else {
    document.querySelector('#chat-entry-form').submit()
  }
})

