
/**
 * A token:
 *
 * type, position, value, raw
 */

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
  position,
  value,
  raw: value
})

const createStringToken = (str, position) => ({
  type: 'string',
  position,
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

const tokenizeLiteral = (str, index) => {
  if (peek(str, index, 0, 4) === 'true') {
    return {
      offset: 4,
      token: { type: 'literal', position: null, raw: 'true', value: true }
    }
  } else if (peek(str, index, 0, 4) === 'null') {
    return {
      offset: 4,
      token: { type: 'literal', position: null, raw: 'null', value: null }
    }
  } else if (peek(str, index, 0, 5) === 'false') {
    return {
      offset: 5,
      token: { type: 'literal', position: null, raw: 'false', value: false }
    }
  }

  return {}
}

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
    token = tokenizeLiteral(str, index)
    //token = { type: 'literal' }
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