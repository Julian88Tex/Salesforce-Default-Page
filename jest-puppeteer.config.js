module.exports = {
  launch: {
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--disable-extensions-except=${__dirname}`,
      `--load-extension=${__dirname}`
    ]
  },
  browserContext: 'default'
}; 