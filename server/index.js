const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

const msgs = require('./db/msgs')

const app = express()

app.use(morgan('tiny'))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({
    msg: 'Hello'
  })
})

app.get('/msgs', async (req, res) => {
  const result = await msgs.getMsgs()
  res.json({ msgs: result })
})

app.post('/msgs', async (req, res) => {
  console.log(req)

  try {
    await msgs.addMsg(req.body)
    const allMsgs = await msgs.getMsgs()
    res.json(allMsgs)
  } catch (err) {
    res.status(500)
    res.json(err)
  }
})

const port = process.env.PORT || 8081

app.listen(port, () => {
  console.log(`server is listening on http://localhost:${port}`)
})
