Challenge: Braille Characters as Binary

One day while performing a `docker compose`, I noticed that image download progress in the terminal was represented by a single 8-dot character for each image, where these characters appeared to fill from the bottom to the top as each download reached completion.

I was unfamiliar with these characters, so I decided to look them up, and discovered that they are the Braille Patterns. Here is the page: https://unicode.org/charts/nameslist/c_2800.html

The challenge is three-fold:
1) Output all characters in their native order (monotonically increasing based on codepoint).

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

2) Output all characters such that the least significant bits are always in higher rows than the most significant bits. Within each row, less significant bits should always be left more significant bits. Horizontal-first binary order.


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

3) Output all characters such that the least significant bits are always in columns left of more significant bits. Within each column, less significant bits should always be higher than more significant bits. Vertical-first binary order.

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


The output format is a 16x16 grid with spaces between each character and between each row.

An ideal solution will not need to reference any of the characters, and should leverage a mechanism for translating any value between 0 and 255 into the appropriate codepoints depending on the mode (vertical-first or horizontal-first), then from the codepoint to the character.


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

