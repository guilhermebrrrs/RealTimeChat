const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index/index')
})

router.get('/chat', (req, res) => {
  res.render('chat/chat')
})

module.exports = router