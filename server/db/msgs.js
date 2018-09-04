const Joi = require('joi')
const db = require('./connection')

const schema = Joi.object().keys({
  username: Joi.string().required(),
  subject: Joi.string().required(),
  message: Joi.string().max(5000).required(),
  imageURL: Joi.string().uri({
    scheme: [
      'http',
      'https',
    ]
  })
})

const msgs = db.get('msgs')

function getMsgs () {
  return msgs.find()
}

function addMsg (msg) {
  if (!msg.username) {
    msg.username = "anonymous"
  }

  if (!msg.imageURL) {
    msg.imageURL = "https://avatars.mds.yandex.net/get-pdb/936467/b4a8fe16-20c1-43ae-8e5a-568d52db6152/orig"
  }

  const validation = Joi.validate(msg, schema)

  if (validation.error === null) {
    msg.created = new Date()
    return msgs.insert(msg)
  } else {
    return Promise.reject(validation.error)
  }
}

module.exports = {
  getMsgs,
  addMsg
}
