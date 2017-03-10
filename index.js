
const tokenTypes = [
  {
    regexp: /^\s+/,
    create: (value, position) => ({
      type: 'whitespace',
      position,
      raw: value,
      value
    })
  },

  {
    regexp: /^"(?:[^"\\]|\\.)*"/,
    create: (value, position) => ({
      type: 'string',
      position,
      raw: value,
      value: value
        .slice(1, -1)
        .replace(/\\"/g, '"')
    })
  },

  {
    regexp: /^(true|false|null)/,
    create: (value, position) => ({
      type: 'literal',
      position,
      raw: value,
      value: value === 'null'
        ? null
        : value === 'true'
    })
  },

  {
    regexp: /^(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/,
    create: (value, position) => ({
      type: 'number',
      position,
      raw: value,
      value: +value
    })
  },

  {
    regexp: /^({|}|\[|]|:|,)/,
    create: (value, position) => ({
      type: 'punctuation',
      position,
      raw: value,
      value
    })
  }
]

const tokenize = (
  json,
  tokens = [],
  position = { lineno: 1, column: 1 }
) => {
  let char = json[0]

  if (!char) {
    return tokens
  }

  const [createToken, str] = tokenTypes.reduce((acc, type) => {
    if (acc) return acc
    const str = match(type.regexp)
    if (!str) return acc

    return [
      type.create,
      str
    ]
  }, null)

  const token = createToken(
    str,
    str.length === 1
      ? position
      : { start: position, end: updateColumn(str.length - 1) }
  )

  const lines = str.match(/^\n+/g)

  if (lines) {
    return tokenize(
      advance(lines),
      tokens,
      { lineno: position.lineno + lines.length, column: 1 }
    )
  }

  return next(token)

  function updateColumn (column) {
    return {
      lineno: position.lineno,
      column: position.column + column
    }
  }

  function next (token, nextPosition) {
    return tokenize(
      advance(token.raw),
      tokens.concat([token]),
      nextPosition || updateColumn(token.raw.length)
    )
  }

  function match (re) {
    const m = re.exec(json)
    if (!m) return
    const str = m[0]
    return str
  }

  function advance (str) {
    return json.slice(str.length)
  }
}

module.exports = tokenize
