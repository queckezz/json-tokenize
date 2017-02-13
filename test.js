
const tokenize = require('./')
const test = require('ava')

test('tokenizes a string', (t) => {
  const actual = tokenize('{  "test": true }')
  console.log(actual)
  t.pass()
})