
// Minor (vertical) divisions are every 8 values
// Major (horizontal) divisions are every 64 values
//
// LSB to MSB Ordering:
// * Low / Mid --> top to bottom
// * High -------> left to right
//
// 3 Low    3 Mid    2 High
//  --       --       --
// |o |     | o|     |  |
// |o |     | o|     |  |
// |o |     | o|     |  |
// |  |     |  |     |oo|
//  --       --       --

const baseValue = 0x2800

function remap (bitMap, value) {
  const capped = value & 0xff
  const b0 = bitMap.get(value & 0x01)
  const b1 = bitMap.get(value & 0x02)
  const b2 = bitMap.get(value & 0x04)
  const b3 = bitMap.get(value & 0x08)
  const b4 = bitMap.get(value & 0x10)
  const b5 = bitMap.get(value & 0x20)
  const b6 = bitMap.get(value & 0x40)
  const b7 = bitMap.get(value & 0x80)

  return b0 | b1 | b2 | b3 | b4 | b5 | b6 | b7
}

// Native order
const codepointOrder = (() => {
  const chars = []
  for (let i = 0; i < 256; i++) {
    const codepoint = baseValue + i
    const char = String.fromCharCode(codepoint)
    chars.push(char)
  }
  return chars
})();

function nativeMapper (value) {
  return codepointOrder[value]
}

// Horizontal-first order
const horizontalBinaryOrder = (() => {
  const bitMap = new Map()
  bitMap.set(0,     0)
  bitMap.set(1,     1)
  bitMap.set(2,     8)
  bitMap.set(4,     2)
  bitMap.set(8,    16)
  bitMap.set(16,    4)
  bitMap.set(32,   32)
  bitMap.set(64,   64)
  bitMap.set(128, 128)

  const chars = []
  for (let i = 0; i < 256; i++) {
    const codepoint = baseValue + remap(bitMap, i)
    const char = String.fromCharCode(codepoint)
    chars.push(char)
  }
  return chars
})();

function horizontalMapper (value) {
  return horizontalBinaryOrder[value]
}

// Vertical-first order
const verticalBinaryOrder = (() => {
  const bitMap = new Map()
  bitMap.set(0,     0)
  bitMap.set(1,     1)
  bitMap.set(2,     2)
  bitMap.set(4,     4)
  bitMap.set(8,    64)
  bitMap.set(16,    8)
  bitMap.set(32,   16)
  bitMap.set(64,   32)
  bitMap.set(128, 128)

  const chars = []
  for (let i = 0; i < 256; i++) {
    const codepoint = baseValue + remap(bitMap, i)
    const char = String.fromCharCode(codepoint)
    chars.push(char)
  }
  return chars
})();

function verticalMapper (value) {
  return verticalBinaryOrder[value]
}

// Exports
module.exports = {
  horizontalMapper,
  nativeMapper,
  verticalMapper,
}
