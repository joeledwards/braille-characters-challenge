#! /usr/bin/env node

const {
  horizontalMapper,
  nativeMapper,
  verticalMapper,
} = require('./solution')

console.info('\n===== Codepoint Order =====\n')
display(nativeMapper)

console.info('\n===== Horizontal Binary Order =====\n')
display(horizontalMapper)

console.info('\n===== Vertical Binary Order =====\n')
display(verticalMapper)

function display (mapper) {
  for (let i = 0; i < 16; i++) {
    let line = ''
    for (let j = 0; j < 16; j++) {
      const value = i * 16 + j
      const char = mapper(value)
      line += ` ${char}`
    }

    console.info(`${line}\n`)
  }
}
