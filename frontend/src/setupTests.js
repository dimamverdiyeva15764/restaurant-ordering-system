import '@testing-library/jest-dom'

const IGNORE_WARNINGS = [
  /React Router Future Flag Warning/,
  /Relative route resolution within Splat routes/,
  /React does not recognize the `colorScheme` prop/,
  /React does not recognize the `focusBorderColor` prop/,
]

beforeAll(() => {
  const originalWarn = console.warn
  const originalError = console.error

  console.warn = (...args) => {
    if (IGNORE_WARNINGS.some(r => r.test(args[0]))) {
      return
    }
    originalWarn(...args)
  }

  console.error = (...args) => {
    if (IGNORE_WARNINGS.some(r => r.test(args[0]))) {
      return
    }
    originalError(...args)
  }
})
