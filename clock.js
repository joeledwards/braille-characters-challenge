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

const { module: source, label: legacySourceLabel } = loadMapperSource()

function createIntuitiveMapper () {
  const bitToDot = [
    0x20, // bit0 -> lower right (dot 6)
    0x10, // bit1 -> middle right (dot 5)
    0x08, // bit2 -> upper right (dot 4)
    0x04, // bit3 -> lower left (dot 3)
    0x02, // bit4 -> middle left (dot 2)
    0x01, // bit5 -> upper left (dot 1)
  ]

  return function intuitiveMapper (value) {
    const capped = value & 0x3f
    let offset = 0

    for (let bitIndex = 0; bitIndex < bitToDot.length; bitIndex++) {
      if (capped & (1 << bitIndex)) {
        offset |= bitToDot[bitIndex]
      }
    }

    return String.fromCharCode(BRAILLE_BLOCK_START + offset)
  }
}

const mapperFactory = {
  intuitive: () => ({
    mapper: createIntuitiveMapper(),
    modeLabel: 'intuitive',
    sourceLabel: 'custom mapping',
  }),
  horizontal: () => ({
    mapper: source.horizontalMapper,
    modeLabel: 'horizontal',
    sourceLabel: legacySourceLabel,
  }),
  vertical: () => ({
    mapper: source.verticalMapper,
    modeLabel: 'vertical',
    sourceLabel: legacySourceLabel,
  }),
  native: () => ({
    mapper: source.nativeMapper,
    modeLabel: 'native',
    sourceLabel: legacySourceLabel,
  }),
}

function resolveMapper () {
  const rawArgs = process.argv.slice(2)
  const explicit = rawArgs.find(arg => arg.startsWith('--mode='))
  const shorthand = rawArgs.find(arg => !arg.startsWith('-'))
  const desired = (explicit ? explicit.split('=')[1] : shorthand) || 'intuitive'
  const normalized = desired.toLowerCase()
  const mode = mapperFactory[normalized] ? normalized : 'intuitive'
  return mapperFactory[mode]()
}

const { mapper, modeLabel, sourceLabel } = resolveMapper()

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

function buildReferenceLines (entries) {
  let body = ''

  entries.forEach((entry, index) => {
    const next = entries[index + 1]
    const needsBar = next && (entry.group !== next.group)
    const adjacentYear = entry.group === 0 && next?.group === 0

    body += entry.braille

    if (needsBar) {
      body += '|'
    } else if (!adjacentYear) {
      body += ' '
    }
  })

  return body.trimEnd()
}

function render () {
  const now = new Date()
  const iso = now.toISOString().replace(/\.\d{3}Z$/, 'Z')
  const brailleGlyphs = brailleComponents(now)
  const glyphLine = buildReferenceLines(brailleGlyphs)

  process.stdout.write('\u001Bc')
  process.stdout.write(glyphLine + '\n')
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
