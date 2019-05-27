import puppeteer from 'puppeteer'

const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH

let browser
let killBrowserTimeoutId

export const closeBrowser = async () => {
  if (browser) {
    console.log('Closing browser after 5 seconds of idling')
    browser.close()
    browser = undefined
  }
}

export default async () => {
  if (!browser) {
    browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox'] })
  }
  if (killBrowserTimeoutId) {
    clearTimeout(killBrowserTimeoutId)
  }
  killBrowserTimeoutId = setTimeout(closeBrowser, 5000)
  return browser
}

process.on('beforeExit', closeBrowser)

// do something when app is closing
process.on('exit', closeBrowser)

// catches ctrl+c event
process.on('SIGINT', closeBrowser)

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', closeBrowser)
process.on('SIGUSR2', closeBrowser)

// catches uncaught exceptions
process.on('uncaughtException', closeBrowser)
