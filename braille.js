#! /usr/bin/env node

const chalk = require('chalk')

const solution = require('./solution')
const reference = require('./reference')

console.info('\n===== Codepoint Order =====\n')
display(solution.nativeMapper, reference.nativeMapper)

console.info('\n===== Horizontal Binary Order =====\n')
display(solution.horizontalMapper, reference.horizontalMapper)

console.info('\n===== Vertical Binary Order =====\n')
display(solution.verticalMapper, reference.verticalMapper)

function display (solutionMapper, referenceMapper) {
  for (let i = 0; i < 16; i++) {
    let line = ''
    for (let j = 0; j < 16; j++) {
      const value = i * 16 + j
      const sChar = solutionMapper(value)
      const rChar = referenceMapper(value)
      const dChar = ((sChar === rChar) ? chalk.green : chalk.red)(sChar)

      line += ` ${dChar}`
    }

    console.info(`${line}\n`)
  }
}
