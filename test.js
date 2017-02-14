
const tokenize = require('./')
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
  for (var i = 0; i < tokens.length; i++) {
    t.deepEqual(tokens[i].position, expectedPositions[i])
  }
}

test('builtin', (t) => {
  validateJsonToken(t, 'true', { type: 'literal', raw: 'true', value: true })
  validateJsonToken(t, 'false', { type: 'literal', raw: 'false', value: false })
  validateJsonToken(t, 'null', { type: 'literal', raw: 'null', value: null })
})

test('strings', (t) => {
  validateJsonToken(t, '"hello"', { type: 'string', raw: '"hello"', value: 'hello' })
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
    { lineno: 1, column: 8 },
  ])

  validatePositions(t, ' \n  {', [
    { start: { lineno: 1, column: 1 }, end: { lineno: 2, column: 2 } },
    { lineno: 2, column: 3 },
  ])

  /*validatePositions(t, '{\n  "bool": true\n}', [
    { lineno: 0, column: 0 },
    { start: { lineno: 0, column: 1 }, end: { lineno: 1, column: 3 } },
    { start: { lineno: 1, column: 3 }, end: { lineno: 1, column: 8 } },
    { lineno: 1, column: 9 },
    { lineno: 1, column: 10 },
    { start: { lineno: 1, column: 11 }, end: { lineno: 1, column: 14 } },
    { lineno: 1, column: 15 },
    { lineno: 2, column: 0 },
  ])*/
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