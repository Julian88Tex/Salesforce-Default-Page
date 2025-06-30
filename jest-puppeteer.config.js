module.exports = {
  launch: {
    headless: process.env.CI ? 'new' : false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--disable-extensions-except=${__dirname}/src`,
      `--load-extension=${__dirname}/src`
    ]
  },
  browserContext: 'default'
}; 