
const lpadAlign = require('lpad-align')
const tokenize = require('./')
const chalk = require('chalk')

const obj = {
  a: 12e5,
  b: 'helloworld'
}

const tokens = tokenize(JSON.stringify(obj, null, 2))

const fmtPosition = (pos) => `${pos.lineno}:${pos.column}`

const types = tokenize.tokenizers.map((tokenizer) => chalk.yellow.bold(tokenizer.type))

console.log()

tokens.forEach((token) => {
  const pos = token.position

  const str = pos.start
    ? `L${fmtPosition(pos.start)}-${fmtPosition(pos.end)}`
    : `L${fmtPosition(pos)}`

  console.log(
    lpadAlign(chalk.yellow.bold(token.type), types, 2) + lpadAlign(str, ['a'.repeat(9)], 2),
    token.type === 'whitespace'
      ? ''
      : chalk.blue(token.value)
  )
})
