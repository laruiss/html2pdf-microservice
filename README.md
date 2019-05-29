# html2pdf-microservice

API to transform given html to a PDF file

## Why

On a project for a client, we needed to create a PDF and send a mail with it as an attachment. We could have used
pdfKit or something similar, but it is really difficult to have a clean and maintainable code.
I would like to have only HTML and CSS to maintain. Yes, I could have used [wkhtmltopdf](https://wkhtmltopdf.org/),
but from node.js, it would involve spawning processes to run shell commands, and I didn't like that.

## How to use it

### Client

Here is what a client could look like

```javascript
  const options = {
    hostname: 'localhost',
    port: 7000,
    path: '/api/v1/html2pdf',
    method: 'POST',
    headers: {
      'Accept': 'application/pdf',
      'Content-Type': 'application/json'
    },
  }

  const req = http.request(options, function (res) {
    res.on('data', function (data) {
      writableStream.write(data)
    }).on('end', function () {
      writableStream.end()
    })
  })

  req.on('error', (e) => {
    reject(`Problem with request: ${e.message}`)
  })

  req.write(postData)
  req.end()
```

### Complete client example

```javascript

// reusable-client.js
const http = require('http')
const fs = require('fs')

const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || './'

const options = {
  hostname: 'localhost',
  port: 7000,
  path: '/api/v1/html2pdf',
  method: 'POST',
  headers: {
    'Accept': 'application/pdf',
    'Content-Type': 'application/json'
  },
}

// Returns a Promise<WritableStream>
const getPdfFromHtml = (html, filename = 'Document.pdf') => {
  const file = fs.createWriteStream(DOWNLOAD_DIR + filename)

  const postData = JSON.stringify({
    filename,
    html,
  })

  return new Promise ((resolve, reject) => {
    const req = http.request(options, function (res) {
      res.on('data', function (data) {
        file.write(data)
      }).on('end', function () {
        file.end()
        resolve(file)
      })
    })

    req.on('error', (e) => {
      reject(`Problem with request: ${e.message}`)
    })

    req.write(postData)
    req.end()
  })
}

module.exports = getPdfFromHtml

// app.js
const getPdfFromHtml = require('./reusable-client.js')

getPdfFromHtml({
  filename: 'test.pdf',
  html: `<!DOCTYPE html>
    <html>
      <head>
          <title>
              Hello World
          </title>
          <style>
            h1 {
              text-decoration: underline;
            }
          </style>
      </head>
      <body>
          <h1>
              Hello World from an HTML file!
          </h1>
      </body>
    </html>
  `
})

```

## TODO

- Set port from an environment variable
- Make killBrowserTimeoutId optional
- Set killBrowserTimeoutId and from an environment variable