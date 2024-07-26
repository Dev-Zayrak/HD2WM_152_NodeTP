const mongoose = require('mongoose')

const User = mongoose.model('User', { mail: String, pwd: String }, 'users')

// j'exporte la classe /model Article
module.exports = User;