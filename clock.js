#!/usr/bin/env node

const chalk = require('chalk')

const BRAILLE_BLOCK_START = 0x2800

function isBrailleChar (char) {
  if (typeof char !== 'string' || char.length !== 1) return false
  const code = char.charCodeAt(0)
  return code >= BRAILLE_BLOCK_START && code <= BRAILLE_BLOCK_START + 0xff
}

function loadMapperSource () {
  try {
    const candidate = require('./solution')
    const { horizontalMapper, nativeMapper, verticalMapper } = candidate

    if (isBrailleChar(horizontalMapper?.(0)) &&
        isBrailleChar(nativeMapper?.(0)) &&
        isBrailleChar(verticalMapper?.(0))) {
      return { module: candidate, label: 'solution' }
    }
  } catch (error) {}

  return { module: require('./reference'), label: 'reference' }
}

const { module: source, label: sourceLabel } = loadMapperSource()

const mapperFactory = {
  horizontal: () => source.horizontalMapper,
  vertical: () => source.verticalMapper,
  native: () => source.nativeMapper,
}

function resolveMapper () {
  const rawArgs = process.argv.slice(2)
  const explicit = rawArgs.find(arg => arg.startsWith('--mode='))
  const shorthand = rawArgs.find(arg => !arg.startsWith('-'))
  const desired = (explicit ? explicit.split('=')[1] : shorthand) || 'horizontal'
  const normalized = desired.toLowerCase()
  const mode = mapperFactory[normalized] ? normalized : 'horizontal'
  return { mapper: mapperFactory[mode](), mode }
}

const { mapper, mode } = resolveMapper()

const groupPalette = [
  '#800080', // Year (Purple)
  '#0000FF', // Month (Blue)
  '#00FF7F', // Day (Green)
  '#FFD700', // Hour (Gold)
  '#FF8C00', // Minute (Orange)
  '#FF0000', // Second (Red)
]

const groupStylers = chalk.level > 0
  ? groupPalette.map(color => chalk.hex(color))
  : groupPalette.map(() => value => value)

function stylerForGroup (groupIndex) {
  return groupStylers[groupIndex] || groupStylers[groupStylers.length - 1]
}

function encodeSixBitChunks (value, minimumWidth = 1) {
  const chunks = []
  let remaining = value

  do {
    chunks.unshift(remaining & 0x3f)
    remaining >>= 6
  } while (remaining > 0 || chunks.length < minimumWidth)

  return chunks
}

function brailleComponents (date) {
  const groups = [
    encodeSixBitChunks(date.getUTCFullYear(), 2),
    encodeSixBitChunks(date.getUTCMonth() + 1),
    encodeSixBitChunks(date.getUTCDate()),
    encodeSixBitChunks(date.getUTCHours()),
    encodeSixBitChunks(date.getUTCMinutes()),
    encodeSixBitChunks(date.getUTCSeconds()),
  ]

  const glyphs = []

  groups.forEach((values, groupIndex) => {
    const styler = stylerForGroup(groupIndex)

    values.forEach((value, valueIndex) => {
      const braille = styler(mapper(value))
      glyphs.push({ braille, group: groupIndex, valueIndex })
    })
  })

  return glyphs
}

function render () {
  const now = new Date()
  const iso = now.toISOString().replace(/\.\d{3}Z$/, 'Z')
  const brailleGlyphs = brailleComponents(now)
  const primaryLine = brailleGlyphs
    .map((entry, index, array) => {
      const next = array[index + 1]
      const needsSpace = !(entry.group === 0 && next?.group === 0)
      return needsSpace ? entry.braille + ' ' : entry.braille
    })
    .join('')
    .trimEnd()

  process.stdout.write('\u001Bc')
  process.stdout.write(primaryLine + '\n')
  process.stdout.write(iso + '\n')
  process.stdout.write('\nPress Ctrl+C to exit.\n')
}

render()
const timer = setInterval(render, 1000)

process.on('SIGINT', () => {
  clearInterval(timer)
  process.stdout.write('\n')
  process.exit(0)
})
