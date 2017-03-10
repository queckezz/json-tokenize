
const tokenize = require('./index')
const test = require('ava')

const validateToken = (t, token, expectedToken) => {
  t.is(token.value, expectedToken.value)
  t.is(token.raw, expectedToken.raw)
  t.is(token.type, expectedToken.type)
}

const validateJsonToken = (t, json, expectedToken) => {
  const token = tokenize(json)[0]
  validateToken(t, token, expectedToken)
}

const validateJson = (t, json, expectedTokens) => {
  const tokens = tokenize(json)
  for (var i = 0; i < tokens.length; i++) {
    validateToken(t, tokens[i], expectedTokens[i])
  }
}

const validatePositions = (t, json, expectedPositions) => {
  const tokens = tokenize(json)
  tokens.forEach((token, i) => {
    t.deepEqual(token.position, expectedPositions[i])
  })
}

test('builtin', (t) => {
  validateJsonToken(t, 'true', { type: 'literal', raw: 'true', value: true })
  validateJsonToken(t, 'false', { type: 'literal', raw: 'false', value: false })
  validateJsonToken(t, 'null', { type: 'literal', raw: 'null', value: null })
})

test('strings', (t) => {
  validateJsonToken(t, '"hello"', { type: 'string', raw: '"hello"', value: 'hello' })
  validateJsonToken(t, '"hello world"', { type: 'string', raw: '"hello world"', value: 'hello world' })
})

test('whitespace', (t) => {
  validateJsonToken(t, '  ', { type: 'whitespace', raw: '  ', value: '  ' })
  validateJsonToken(t, ' \n\r', { type: 'whitespace', raw: ' \n\r', value: ' \n\r' })
})

test('punctuation', (t) => {
  validateJsonToken(t, ':', { type: 'punctuation', raw: ':', value: ':' })
  validateJsonToken(t, '{', { type: 'punctuation', raw: '{', value: '{' })
  validateJsonToken(t, '}', { type: 'punctuation', raw: '}', value: '}' })
})

test('numbers', (t) => {
  validateJsonToken(t, '1', { type: 'number', value: 1, raw: '1' })
  validateJsonToken(t, '1.0', { type: 'number', value: 1, raw: '1.0' })
  validateJsonToken(t, '1.000', { type: 'number', value: 1, raw: '1.000' })
  validateJsonToken(t, '1.5', { type: 'number', value: 1.5, raw: '1.5' })
  validateJsonToken(t, '-1.5', { type: 'number', value: -1.5, raw: '-1.5' })
  validateJsonToken(t, '123e5', { type: 'number', value: 123e5, raw: '123e5' })
  validateJsonToken(t, '123e-5', { type: 'number', value: 123e-5, raw: '123e-5' })
})

test('position', (t) => {
  validatePositions(t, '{', [{ lineno: 1, column: 1 }])

  validatePositions(t, '{"test"}', [
    { lineno: 1, column: 1 },
    { start: { lineno: 1, column: 2 }, end: { lineno: 1, column: 7 } },
    { lineno: 1, column: 8 }
  ])

  validatePositions(t, '\n  {', [
    { start: { lineno: 2, column: 1 }, end: { lineno: 2, column: 2 } },
    { lineno: 2, column: 3 }
  ])

  validatePositions(t, '\n {', [
    { lineno: 2, column: 1 },
    { lineno: 2, column: 2 }
  ])

  validatePositions(t, '{\n  "bool": true\n}', [
    { lineno: 1, column: 1 },
    { start: { lineno: 2, column: 1 }, end: { lineno: 2, column: 2 } },
    { start: { lineno: 2, column: 3 }, end: { lineno: 2, column: 8 } },
    { lineno: 2, column: 9 },
    { lineno: 2, column: 10 },
    { start: { lineno: 2, column: 11 }, end: { lineno: 2, column: 14 } },
    { lineno: 3, column: 1 }
  ])
})

test('json', (t) => {
  validateJson(t, '{  "hello": true, "json": "string" }', [
    { type: 'punctuation', raw: '{', value: '{' },
    { type: 'whitespace', raw: '  ', value: '  ' },
    { type: 'string', raw: '"hello"', value: 'hello' },
    { type: 'punctuation', raw: ':', value: ':' },
    { type: 'whitespace', raw: ' ', value: ' ' },
    { type: 'literal', raw: 'true', value: true },
    { type: 'punctuation', raw: ',', value: ',' },
    { type: 'whitespace', raw: ' ', value: ' ' },
    { type: 'string', raw: '"json"', value: 'json' },
    { type: 'punctuation', raw: ':', value: ':' },
    { type: 'whitespace', raw: ' ', value: ' ' },
    { type: 'string', raw: '"string"', value: 'string' },
    { type: 'whitespace', raw: ' ', value: ' ' },
    { type: 'punctuation', raw: '}', value: '}' }
  ])
})

test('double-encoded json', (t) => {
  const inner = JSON.stringify({ x: 1, y: '2' })
  const outer = JSON.stringify({ type: 'blob', data: inner })
  const innerEnc = JSON.stringify(inner)
  validateJson(t, outer, [
    { type: 'punctuation', raw: '{', value: '{' },
    { type: 'string', raw: '"type"', value: 'type' },
    { type: 'punctuation', raw: ':', value: ':' },
    { type: 'string', raw: '"blob"', value: 'blob' },
    { type: 'punctuation', raw: ',', value: ',' },
    { type: 'string', raw: '"data"', value: 'data' },
    { type: 'punctuation', raw: ':', value: ':' },
    { type: 'string', raw: innerEnc, value: inner },
    { type: 'punctuation', raw: '}', value: '}' }
  ])
})
