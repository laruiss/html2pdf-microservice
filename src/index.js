import http from 'http'

import app from './app'

const PORT = process.env.PORT || 7000
const ADDRESS = process.env.ADDRESS || '0.0.0.0'

http.createServer(app).listen(PORT, ADDRESS)
console.log(`Server listening at ${ADDRESS}:${PORT}`)
