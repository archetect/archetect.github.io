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

// ANCHOR: step_04
---
script:

  - set:
      name:
        prompt: "What is your name?"

  - trace: "camelCased: {{ name | camel_case }}"
  - debug: "train-cased: {{ name | train_case }}"
  - info: "snake_cased: {{ name | snake_case }}"
  - warn: "CONSTANT_CASED: {{ name | constant_case }}"
  - error: "PascalCased: {{ name | pascal_case }}"

  - display: ""
  - display: "This text, like the messages above, is going to STDERR"
  - display: ""

  - display: |
      We can use YAML multi-line syntax.  This syntax preserves newlines.

        Isn't  it cool?

  - display: >
      This syntax discards newlines.

      The following text is going to STDOUT.

  - print: "Hello, {{ name | title_case }}!"

// ANCHOR_END: step_04

// ANCHOR: step_05
---
script:

  - set:
      class:
        prompt: "What is the name of your class?"

      ClassName:
        value: "{{ class | pascal_case }}"

      className:
        value: "{{ class | camel_case }}"

  - print: |
      public class {{ ClassName }} {
          private static {{ ClassName }} {{ className }} = new {{ ClassName }}();

          private {{ ClassName }}(){}

          public static {{ ClassName }} getInstance(){
             return {{ className }};
          }

          public void printMessage() {
              System.out.println("This is a contrived example. You can try this at home... but don't try it at work!");
          }
    
          public static void main(String[] args) {
              {{ ClassName }}.getInstance().printMessage();
          }
      }

// ANCHOR_END: step_05
