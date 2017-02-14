
const tokenize = require('./')
const test = require('ava')

const validateToken = (t, json, expectedToken) => {
  const token = tokenize(json)[0]
  t.is(token.value, expectedToken.value)
  t.is(token.raw, expectedToken.raw)
  t.is(token.type, expectedToken.type)
}

test('builtin', (t) => {
  validateToken(t, 'true', { type: 'literal', raw: 'true', value: true })
  validateToken(t, 'false', { type: 'literal', raw: 'false', value: false })
  validateToken(t, 'null', { type: 'literal', raw: 'null', value: null })
})

test('strings', (t) => {
  validateToken(t, '"hello"', { type: 'string', raw: '"hello"', value: 'hello' })
})

test('whitespace', (t) => {
  validateToken(t, '  ', { type: 'whitespace', raw: '  ', value: '  ' })
  validateToken(t, ' \n\r', { type: 'whitespace', raw: ' \n\r', value: ' \n\r' })
})

test('punctuation', (t) => {
  validateToken(t, ':', { type: 'punctuation', raw: ':', value: ':' })
  validateToken(t, '{', { type: 'punctuation', raw: '{', value: '{' })
  validateToken(t, '}', { type: 'punctuation', raw: '}', value: '}' })
})

test.skip('numbers', (t) => {
    validateToken(t, '1', [{ type: 'number', value: 1, raw: '1' }])
    validateToken(t, '1.0', [{ type: 'number', value: 1, raw: '1.0' }])
    validateToken(t, '1.000', [{ type: 'number', value: 1, raw: '1.000' }])
    validateToken(t, '1.5', [{ type: 'number', value: 1.5, raw: '1.5' }])
    validateToken(t, '-1.5', [{ type: 'number', value: -1.5, raw: '-1.5' }])
    validateToken(t, '123e5', [{ type: 'number', value: 123e5, raw: '123e5' }])
    validateToken(t, '123e-5', [{ type: 'number', value: 123e-5, raw: '123e-5' }])
})

test('json', (t) => {
  t.deepEqual(tokenize('"hello": true, "json": "string"'), [
    { type: 'string', position: null, raw: '"hello"', value: 'hello' },
    { type: 'punctuation', position: null, raw: ':', value: ':' },
    { type: 'whitespace', position: null, raw: ' ', value: ' ' },
    { type: 'literal', position: null, raw: 'true', value: true },
    { type: 'punctuation', position: null, raw: ',', value: ',' },
    { type: 'whitespace', position: null, raw: ' ', value: ' ' },
    { type: 'string', position: null, raw: '"json"', value: 'json' },
    { type: 'punctuation', position: null, raw: ':', value: ':' },
    { type: 'whitespace', position: null, raw: ' ', value: ' ' },
    { type: 'string', position: null, raw: '"string"', value: 'string' },
  ])
})