import express from 'express'
import bodyParser from 'body-parser'
import fileupload from 'express-fileupload'

import npmVersion from '../package.json'
import mime from 'mime'
import convertToPdf from './convert-to-pdf'

const app = express()

app.disable('x-powered-by')

export const apiPrefix = '/api/v1'

app.get(`${apiPrefix}/version`, function (req, res) {
  res.send(npmVersion.version)
})

app.use(bodyParser.json({ limit: '20mb' }))
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }))
app.use(fileupload({ limits: { fileSize: 50 * 1024 * 1024 } }))

app.post(`${apiPrefix}/html2pdf`, async (req, res) => {
  const { html, filename } = req.body
  try {
    const buffer = await convertToPdf(html)

    const mimetype = mime.lookup(filename)
    res.set({
      'Content-Type': mimetype,
      'Content-Disposition': `attachment; filename="${filename}"`,
    })
    res.send(buffer)
  } catch (error) {
    res.json({
      error: error.message,
    })
  }
})

export default app
