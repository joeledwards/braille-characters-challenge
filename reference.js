
/**
 * There are 256 distinct charcters representing all of the possible 
 * permutations of visible/invisible dots in the 4x2 grid. These are 
 * represented by unicode codepoints 0x2800 - 0x28ff. Masking off the
 * base value of 0x2800, we get a mapping from 0x00 to 0xff
 * (0 - 255 decimal). If you look at how each of the "bits" change based
 * on the associated, masked value, you can see that they behave exactly
 * like the bits in a byte. The position of each bit has to be determined
 * in order to correctly translate from one ordering to another in
 * the various mapper functions that drive each of the solutions.
 *
 * LSB to MSB Ordering:
 * * Low / Mid --> top to bottom
 * * High -------> left to right
 *
 * 3 Low    3 Mid    2 High
 *  --       --       --
 * |o |     | o|     |  |
 * |o |     | o|     |  |
 * |o |     | o|     |  |
 * |  |     |  |     |oo|
 *  --       --       --
 *
 *  Coordinates of bits in order of least to most significant:
 *  (0, 3) => 1
 *  (0, 2) => 2
 *  (0, 1) => 4
 *  (1, 3) => 8
 *  (1, 2) => 16
 *  (1, 1) => 32
 *  (0, 0) => 64
 *  (1, 0) => 128
 *
 *
 * Native:
 *
 * For the native order mapper, we can just translate every value (0 - 255)
 * into the appropriate codepoint by ORing (adding) the base value with
 * the value:
 *
 * 0x2800 | 0x002f => 0x282f
 *
 *
 *
 * Horizontal/Vertical:
 *
 * For the other mappings, we need to translate the position of the bits.
 * Turns out this is as simple as re-mapping the values associated with
 * each bit. Since the position of each bit is stable, all we have to do
 * is create a mapping between the bits of the input value and the bits
 * of the desired output location of each of those bits.
 *
 * For example, let's say we want to map bit 2 to the correct location
 * for vertical orientation. Since bit 2 is at position (0, 2) for both
 * the native and the vertical orientation, nothing needs to change. So
 * bit 2 retains its value of 2.
 *
 * 2 Native    2 Vertical
 *  --          -- 
 * |  |        |  |
 * |o |        |o |
 * |  |        |  |
 * |  |        |  |
 *  --          -- 
 *
 * However, when we want to map bit 2 to the correct location for
 * horizontal orientation, we need to adjust it to match the value
 * for the bit in that same position in the native orientation. This
 * means we have to map bit 2 to a value of 8. This is because we
 * want bit 2 to be placed at (1, 3), and the bit value at that
 * location in native orientation is 8.
*
 * 2 Native    2 Horizontal
 *  --          -- 
 * |  |        | o|
 * |o |        |  |
 * |  |        |  |
 * |  |        |  |
 *  --          -- 
 *
 * Using this same approach for all bits, we just need to build a map
 * between bit values for each orientation. This maps are contained in
 * the `horizontalBinaryOrder` and `verticalBinaryorder` variables.
 *
 * Then we can do a lookup in the bit map for each bit in the incoming value,
 * then combine all of those into the native value containing the desired bit
 * sequence. This is still a value between 0 and 255. Later we convert this into
 * a codepoint and then a character. This lookup and combination logic is
 * located in the remap() function.
 */

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
