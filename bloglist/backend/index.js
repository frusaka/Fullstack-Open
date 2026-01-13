const { PORT } = require('./utils/config')
const app = require('./app')

app.listen(PORT)
console.log(`Listening on port ${PORT}`)
