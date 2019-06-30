import puppeteer from 'puppeteer'

const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH

const killBrowserTimeout = process.env.KILL_BROWSER_TIMEOUT_ID || 5000
let browser
let killBrowserTimeoutId

export const closeBrowser = async () => {
  if (browser) {
    console.log('Closing browser after 5 seconds of idling')
    browser.close()
    browser = undefined
  }
}

export const cleanExit = async () => {
  try {
    closeBrowser()
    process.exit(0)
  } catch (error) {
    process.exit(1)
  }
}

export default async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox'],
    })
  }
  if (killBrowserTimeoutId) {
    clearTimeout(killBrowserTimeoutId)
  }
  killBrowserTimeoutId = setTimeout(closeBrowser, killBrowserTimeout)
  return browser
}

process.on('beforeExit', closeBrowser)

// do something when app is closing
process.on('exit', cleanExit)

// catches ctrl+c event
process.on('SIGINT', cleanExit)

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', cleanExit)
process.on('SIGUSR2', cleanExit)

// catches uncaught exceptions
process.on('uncaughtException', cleanExit)
