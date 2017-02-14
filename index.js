
const WHITESPACE_CHARS = [
  '\t',
  '\n',
  '\r',
  ' '
]

const PUNCTUATION_CHARS = [
  '{',
  '}',
  '[',
  ']',
  ':',
  ','
]

const createWhitespaceToken = (value, position) => ({
  type: 'whitespace',
  position: position || null,
  value,
  raw: value
})

const createStringToken = (str, position) => ({
  type: 'string',
  position: position || null,
  value: str.slice(1, -1),
  raw: str
})

const peek = (str, index, from, to) => {
  if (!to) {
    return str[index + from]
  }

  return str.slice(index + from, index + to)
}

const tokenizeString = (str, index) => {
  return _tokenizeString(0, '')

  function _tokenizeString (offset, acc) {
    const char = peek(str, index, offset)
    const accStr = acc + char

    return char === '"' && offset > 0
      ? { offset: offset + 1, token: createStringToken(accStr) }
      : _tokenizeString(offset + 1, accStr )
  }
}

const tokenizeWhitespace = (str, index) => {
  return _tokenizeWhitespace(0, '')

  function _tokenizeWhitespace (offset, acc) {
    const char = peek(str, index, offset)
    const nextChar = peek(str, index, offset + 1)
    const accStr = acc + char

    return !WHITESPACE_CHARS.includes(nextChar)
      ? { offset: offset + 1, token: createWhitespaceToken(accStr) }
      : _tokenizeWhitespace(offset + 1, accStr )
  }
}

const tokenizeBuiltin = (str, index, raw, value) => {
  const offset = raw.length
  if (peek(str, index, 0, offset) === raw) {
    return {
      offset,
      token: { type: 'literal', position: null, raw, value }
    }
  }
}

const tokenizeNumber = (str, index) => {
  return {}
}

const tokenizeLiteral = (str, index) => [
  tokenizeBuiltin(str, index, 'null', null),
  tokenizeBuiltin(str, index, 'true', true),
  tokenizeBuiltin(str, index, 'false', false)
].reduce((acc, next) => {
  if (!next || acc)
    return acc

  return next
}, null)

const tokenAt = (str, index) => {
  const char = str[index]

  if (!char) {
    return null
  }

  let token

  if (WHITESPACE_CHARS.includes(char)) {
    token = tokenizeWhitespace(str, index)
  } else if (PUNCTUATION_CHARS.includes(char)) {
    token = { type: 'punctuation', position: null, value: char, raw: char }
  } else if ('"' === char) {
    token = tokenizeString(str, index)
  } else {
    token = char === '-' || !isNaN(char)
      ? tokenizeNumber(str, index)
      : tokenizeLiteral(str, index)
  }

  return token.offset ? token : { offset: 1, token }
}

const tokenizeAtPosition = (str, index, tokens) => {
  const next = tokenAt(str, index)

  if (!next) {
    return tokens
  }

  return tokenizeAtPosition(str, index + next.offset, tokens.concat([next.token]))
}

const tokenize = (str) => {
  return tokenizeAtPosition(str, 0, [])
}

module.exports = tokenize