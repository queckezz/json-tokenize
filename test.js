
const tokenize = require('./')
const test = require('ava')

test('tokenizes a string', (t) => {
  const actual = tokenize('{  "test": true, "prop": null }')
  console.log(actual)
  t.pass()
})