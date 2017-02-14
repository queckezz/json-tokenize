
const assign = (...obj) => Object.assign({}, ...obj)

const punctuationToken = () => {
  const type = 'punctuation'

  return {
    type,
    regexp: /^({|}|\[|]|:|,)/,
    create (value, position) {
      return { type, position, raw: value, value }
    }
  }
}

const numberToken = () => {
  const type = 'number'

  return {
    type,

    // Thanks Andrew! http://stackoverflow.com/a/13340826
    regexp: /^(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/,
    create (value, position) {
      return { type, position, raw: value, value: +value }
    }
  }
}

const literalToken = () => {
  const type = 'literal'

  return {
    type,
    regexp: /^(true|false|null)/,
    create (value, position) {
      const parsedValue = value == 'null' ? null : value == 'true'
      return { type: 'literal', position, raw: value, value: parsedValue }
    }
  }
}

const stringToken = () => {
  const type = 'string'

  return {
    type,
    regexp: /^"\w+"/,
    create (value, position) {
      return { type, position, raw: value, value: value.slice(1, -1) }
    }
  }
}

const whitespaceToken = () => {
  const type = 'whitespace'

  return {
    type,
    regexp: /^\s+/,
    create (value, position) {
      return { type, position, raw: value, value }
    }
  }
}

const tokenizers = [
  literalToken(),
  punctuationToken(),
  stringToken(),
  whitespaceToken(),
  numberToken()
]

const tokenize = (
  json,
  state = {
    tokens: [],
    position: { lineno: 1, column: 1 }
  }
) => {
  let char = json[0]

  if (!char) {
    return state.tokens
  }

  const { tokenizer, str } = tokenizers.reduce((acc, tokenizer) => {
    if (acc) return acc
    const str = match(tokenizer.regexp)
    if (!str) return acc
    return { tokenizer, str }
  }, null)

  const token = tokenizer.create(
    str,
    str.length === 1
      ? state.position
      : { start: state.position, end: updateColumn(str.length - 1) }
  )

  switch (tokenizer.type) {
    case 'whitespace':
      const lines = str.match(/\n/g)

      if (!lines)
        return next(token)

      const offset = str.lastIndexOf('\n') + lines.length

      const endPosition = {
        lineno: state.position.lineno + lines.length,
        column: str.length - offset
      }

      return next(
        tokenizer.create(str, { start: state.position, end: endPosition }),
        assign(endPosition, { column: endPosition.column + 1 })
      )
    default:
      return next(token)
  }

  function updateColumn (column) {
    return {
      lineno: state.position.lineno,
      column: state.position.column + column
    }
  }

  function next (token, position) {
    return tokenize(advance(token.raw), {
      tokens: state.tokens.concat([token]),
      position: position || updateColumn(token.raw.length)
    })
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