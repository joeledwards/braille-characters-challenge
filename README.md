# Braille Characters as Binary Challenge

One day while performing a `docker compose`, I noticed that image download progress in the terminal was represented by a single character for each image, where each character was composed of a 4x2 grid of 8 dots. The characters appeared to fill from the bottom to the top as each download reached completion.

I was unfamiliar with these characters, so I decided to look them up, and discovered that they are the Braille Patterns. Here is the page: https://unicode.org/charts/nameslist/c_2800.html

The patterns in these characters made me think of bits in a byte, and based on my observation of the sequencing the dots in the characters in relation to their unicode codepoints, I challenged myself to sequence them in a couple of different patterns.

I pose the same challenge to you.


## The Challenge

The challenge is three-fold:

### 1) Native ordering

Output all characters in their native order (monotonically increasing based on codepoint).

Example values translated to Braille characters in Native Order:
```
  0      1      2      3      8      13     27     73 
  --     --     --     --     --     --     --     -- 
 |  |   |o |   |  |   |o |   | o|   |oo|   |oo|   |oo|
 |  |   |  |   |o |   |o |   |  |   |  |   |oo|   |  |
 |  |   |  |   |  |   |  |   |  |   |o |   |  |   |  |
 |  |   |  |   |  |   |  |   |  |   |  |   |  |   |o |
  --     --     --     --     --     --     --     -- 
```

### 2) Horizontal-first binary ordering

Output all characters such that the least significant bits are always in higher rows than the most significant bits. Within each row, less significant bits should always be left more significant bits.


Example values translated to Braille characters in Horizontal Order:
```
  0      1      2      3      8      13     27     73 
  --     --     --     --     --     --     --     -- 
 |  |   |o |   | o|   |oo|   |  |   |o |   |oo|   |o |
 |  |   |  |   |  |   |  |   | o|   |oo|   | o|   | o|
 |  |   |  |   |  |   |  |   |  |   |  |   |o |   |  |
 |  |   |  |   |  |   |  |   |  |   |  |   |  |   |o |
  --     --     --     --     --     --     --     -- 
```

### 3) Vertical-first binary ordering

Output all characters such that the least significant bits are always in columns left of more significant bits. Within each column, less significant bits should always be higher than more significant bits.

Example values translated to Braille characters in Vertical Order:
```
  0      1      2      3      8      13     27     73 
  --     --     --     --     --     --     --     -- 
 |  |   |o |   |  |   |o |   |  |   |o |   |oo|   |o |
 |  |   |  |   |o |   |o |   |  |   |  |   |o |   |  |
 |  |   |  |   |  |   |  |   |  |   |o |   |  |   | o|
 |  |   |  |   |  |   |  |   |o |   |o |   |o |   |o |
  --     --     --     --     --     --     --     -- 
```

## Solution

The output format for each sequence is a 16x16 grid with spaces between each character and an empty line between each row.

An ideal solution will not need to reference any of the characters, and should leverage a mechanism for translating any value between 0 and 255 into the appropriate codepoints depending on the mode (native, horizontal-first, or vertical-first), then translate the codepoint into a character.

You can either start from scratch (necessary if you want to use a language other than Javascript), or you can fill out the functions in `solution.js`. Running `braille.js` will compare your solution with the solution in `reference.js`, indicating correct mappings in green and incorrect mappings in red.


### Implementing solution.js

If you go the route of implementing `solution.js`, things get a little simpler, as you are just figuring out how to translate a value between `0` and `255` to the correct character depending on the ordering.

The functions are:
* `horizontalMapper()` | example: `horizontalMapper(27)` == `⠝`
* `nativeMapper()`     | example: `nativeMapper(27)` == `⠛`
* `verticalMapper()`   | example: `verticalMapper(27)` == `⡋`



### Reference output

Codepoint (native) order:
```

 ⠀ ⠁ ⠂ ⠃ ⠄ ⠅ ⠆ ⠇ ⠈ ⠉ ⠊ ⠋ ⠌ ⠍ ⠎ ⠏

 ⠐ ⠑ ⠒ ⠓ ⠔ ⠕ ⠖ ⠗ ⠘ ⠙ ⠚ ⠛ ⠜ ⠝ ⠞ ⠟

 ⠠ ⠡ ⠢ ⠣ ⠤ ⠥ ⠦ ⠧ ⠨ ⠩ ⠪ ⠫ ⠬ ⠭ ⠮ ⠯

 ⠰ ⠱ ⠲ ⠳ ⠴ ⠵ ⠶ ⠷ ⠸ ⠹ ⠺ ⠻ ⠼ ⠽ ⠾ ⠿

 ⡀ ⡁ ⡂ ⡃ ⡄ ⡅ ⡆ ⡇ ⡈ ⡉ ⡊ ⡋ ⡌ ⡍ ⡎ ⡏

 ⡐ ⡑ ⡒ ⡓ ⡔ ⡕ ⡖ ⡗ ⡘ ⡙ ⡚ ⡛ ⡜ ⡝ ⡞ ⡟

 ⡠ ⡡ ⡢ ⡣ ⡤ ⡥ ⡦ ⡧ ⡨ ⡩ ⡪ ⡫ ⡬ ⡭ ⡮ ⡯

 ⡰ ⡱ ⡲ ⡳ ⡴ ⡵ ⡶ ⡷ ⡸ ⡹ ⡺ ⡻ ⡼ ⡽ ⡾ ⡿

 ⢀ ⢁ ⢂ ⢃ ⢄ ⢅ ⢆ ⢇ ⢈ ⢉ ⢊ ⢋ ⢌ ⢍ ⢎ ⢏

 ⢐ ⢑ ⢒ ⢓ ⢔ ⢕ ⢖ ⢗ ⢘ ⢙ ⢚ ⢛ ⢜ ⢝ ⢞ ⢟

 ⢠ ⢡ ⢢ ⢣ ⢤ ⢥ ⢦ ⢧ ⢨ ⢩ ⢪ ⢫ ⢬ ⢭ ⢮ ⢯

 ⢰ ⢱ ⢲ ⢳ ⢴ ⢵ ⢶ ⢷ ⢸ ⢹ ⢺ ⢻ ⢼ ⢽ ⢾ ⢿

 ⣀ ⣁ ⣂ ⣃ ⣄ ⣅ ⣆ ⣇ ⣈ ⣉ ⣊ ⣋ ⣌ ⣍ ⣎ ⣏

 ⣐ ⣑ ⣒ ⣓ ⣔ ⣕ ⣖ ⣗ ⣘ ⣙ ⣚ ⣛ ⣜ ⣝ ⣞ ⣟

 ⣠ ⣡ ⣢ ⣣ ⣤ ⣥ ⣦ ⣧ ⣨ ⣩ ⣪ ⣫ ⣬ ⣭ ⣮ ⣯

 ⣰ ⣱ ⣲ ⣳ ⣴ ⣵ ⣶ ⣷ ⣸ ⣹ ⣺ ⣻ ⣼ ⣽ ⣾ ⣿

```

Hortizontal-first binary order:
```
 ⠀ ⠁ ⠈ ⠉ ⠂ ⠃ ⠊ ⠋ ⠐ ⠑ ⠘ ⠙ ⠒ ⠓ ⠚ ⠛

 ⠄ ⠅ ⠌ ⠍ ⠆ ⠇ ⠎ ⠏ ⠔ ⠕ ⠜ ⠝ ⠖ ⠗ ⠞ ⠟

 ⠠ ⠡ ⠨ ⠩ ⠢ ⠣ ⠪ ⠫ ⠰ ⠱ ⠸ ⠹ ⠲ ⠳ ⠺ ⠻

 ⠤ ⠥ ⠬ ⠭ ⠦ ⠧ ⠮ ⠯ ⠴ ⠵ ⠼ ⠽ ⠶ ⠷ ⠾ ⠿

 ⡀ ⡁ ⡈ ⡉ ⡂ ⡃ ⡊ ⡋ ⡐ ⡑ ⡘ ⡙ ⡒ ⡓ ⡚ ⡛

 ⡄ ⡅ ⡌ ⡍ ⡆ ⡇ ⡎ ⡏ ⡔ ⡕ ⡜ ⡝ ⡖ ⡗ ⡞ ⡟

 ⡠ ⡡ ⡨ ⡩ ⡢ ⡣ ⡪ ⡫ ⡰ ⡱ ⡸ ⡹ ⡲ ⡳ ⡺ ⡻

 ⡤ ⡥ ⡬ ⡭ ⡦ ⡧ ⡮ ⡯ ⡴ ⡵ ⡼ ⡽ ⡶ ⡷ ⡾ ⡿

 ⢀ ⢁ ⢈ ⢉ ⢂ ⢃ ⢊ ⢋ ⢐ ⢑ ⢘ ⢙ ⢒ ⢓ ⢚ ⢛

 ⢄ ⢅ ⢌ ⢍ ⢆ ⢇ ⢎ ⢏ ⢔ ⢕ ⢜ ⢝ ⢖ ⢗ ⢞ ⢟

 ⢠ ⢡ ⢨ ⢩ ⢢ ⢣ ⢪ ⢫ ⢰ ⢱ ⢸ ⢹ ⢲ ⢳ ⢺ ⢻

 ⢤ ⢥ ⢬ ⢭ ⢦ ⢧ ⢮ ⢯ ⢴ ⢵ ⢼ ⢽ ⢶ ⢷ ⢾ ⢿

 ⣀ ⣁ ⣈ ⣉ ⣂ ⣃ ⣊ ⣋ ⣐ ⣑ ⣘ ⣙ ⣒ ⣓ ⣚ ⣛

 ⣄ ⣅ ⣌ ⣍ ⣆ ⣇ ⣎ ⣏ ⣔ ⣕ ⣜ ⣝ ⣖ ⣗ ⣞ ⣟

 ⣠ ⣡ ⣨ ⣩ ⣢ ⣣ ⣪ ⣫ ⣰ ⣱ ⣸ ⣹ ⣲ ⣳ ⣺ ⣻

 ⣤ ⣥ ⣬ ⣭ ⣦ ⣧ ⣮ ⣯ ⣴ ⣵ ⣼ ⣽ ⣶ ⣷ ⣾ ⣿

```

Vertical-first binary order:
```

 ⠀ ⠁ ⠂ ⠃ ⠄ ⠅ ⠆ ⠇ ⡀ ⡁ ⡂ ⡃ ⡄ ⡅ ⡆ ⡇

 ⠈ ⠉ ⠊ ⠋ ⠌ ⠍ ⠎ ⠏ ⡈ ⡉ ⡊ ⡋ ⡌ ⡍ ⡎ ⡏

 ⠐ ⠑ ⠒ ⠓ ⠔ ⠕ ⠖ ⠗ ⡐ ⡑ ⡒ ⡓ ⡔ ⡕ ⡖ ⡗

 ⠘ ⠙ ⠚ ⠛ ⠜ ⠝ ⠞ ⠟ ⡘ ⡙ ⡚ ⡛ ⡜ ⡝ ⡞ ⡟

 ⠠ ⠡ ⠢ ⠣ ⠤ ⠥ ⠦ ⠧ ⡠ ⡡ ⡢ ⡣ ⡤ ⡥ ⡦ ⡧

 ⠨ ⠩ ⠪ ⠫ ⠬ ⠭ ⠮ ⠯ ⡨ ⡩ ⡪ ⡫ ⡬ ⡭ ⡮ ⡯

 ⠰ ⠱ ⠲ ⠳ ⠴ ⠵ ⠶ ⠷ ⡰ ⡱ ⡲ ⡳ ⡴ ⡵ ⡶ ⡷

 ⠸ ⠹ ⠺ ⠻ ⠼ ⠽ ⠾ ⠿ ⡸ ⡹ ⡺ ⡻ ⡼ ⡽ ⡾ ⡿

 ⢀ ⢁ ⢂ ⢃ ⢄ ⢅ ⢆ ⢇ ⣀ ⣁ ⣂ ⣃ ⣄ ⣅ ⣆ ⣇

 ⢈ ⢉ ⢊ ⢋ ⢌ ⢍ ⢎ ⢏ ⣈ ⣉ ⣊ ⣋ ⣌ ⣍ ⣎ ⣏

 ⢐ ⢑ ⢒ ⢓ ⢔ ⢕ ⢖ ⢗ ⣐ ⣑ ⣒ ⣓ ⣔ ⣕ ⣖ ⣗

 ⢘ ⢙ ⢚ ⢛ ⢜ ⢝ ⢞ ⢟ ⣘ ⣙ ⣚ ⣛ ⣜ ⣝ ⣞ ⣟

 ⢠ ⢡ ⢢ ⢣ ⢤ ⢥ ⢦ ⢧ ⣠ ⣡ ⣢ ⣣ ⣤ ⣥ ⣦ ⣧

 ⢨ ⢩ ⢪ ⢫ ⢬ ⢭ ⢮ ⢯ ⣨ ⣩ ⣪ ⣫ ⣬ ⣭ ⣮ ⣯

 ⢰ ⢱ ⢲ ⢳ ⢴ ⢵ ⢶ ⢷ ⣰ ⣱ ⣲ ⣳ ⣴ ⣵ ⣶ ⣷

 ⢸ ⢹ ⢺ ⢻ ⢼ ⢽ ⢾ ⢿ ⣸ ⣹ ⣺ ⣻ ⣼ ⣽ ⣾ ⣿
```

