// ANCHOR: step_01
---
script:

    - info: "Hello, World!"
// ANCHOR_END: step_01

// ANCHOR: step_02
---
script:

    - set:
        name:
            prompt: "What is your name?"

    - info: "Hello, {{ name }}!"
// ANCHOR_END: step_02


// ANCHOR: step_03
---
script:

    - set:
        name:
            prompt: "What is your name?"

    - info: "Hello, {{ name | title_case }}!"
// ANCHOR_END: step_03
