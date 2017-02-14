
const indentString = require('indent-string')
const lpadAlign = require('lpad-align')
const tokenize = require('./')
const chalk = require('chalk')

const obj = {
  a: 12e5,
  b: "helloworld"
}

const tokens = tokenize(JSON.stringify(obj, null, 2))

const fmtPosition = (pos) => `${pos.lineno}:${pos.column}`

const types = tokenize.tokenizers.map((tokenizer) => chalk.yellow.bold(tokenizer.type))

tokens.forEach((token) => {
  const pos = token.position

  const str = pos.start
    ? `${fmtPosition(pos.start)}:${fmtPosition(pos.end)}`
    : `${fmtPosition(pos)}`

  console.log(
    lpadAlign(chalk.yellow.bold(token.type), types, 2) + lpadAlign(str, ['a'.repeat(8)], 2),
    token.type === 'whitespace'
      ? ''
      : chalk.blue(token.value)
  )
})
