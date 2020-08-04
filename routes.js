const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('views/index/index')
})

router.get('/chat', (req, res) => {
  res.render('views/chat/chat')
})

router.get('/chatentry', (req, res) => {
  res.render('views/chat-entry/chat-entry')
})

module.exports = router