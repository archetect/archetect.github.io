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
  
  - display: "Hello, {{ name | title_case }}!"
  
  - display: |
  
    Let's generate a simple Java class...
  
    We'll begin by prompting for the name of our class, and then create variables in different casings as needed
    in our template.
  
  - set:
    class:
    prompt: "What is the name of your class?"
  
    ClassName:
    value: "{{ class | pascal_case }}"
  
    className:
    value: "{{ class | camel_case }}"
  
  - info: "Our PascalCased class name is '{{ ClassName }}'"
  - debug: "Our camelCased field name is '{{ className }}'"

// ANCHOR_END: step_04

// ANCHOR: step_05
---
script:

  - set:
    name:
    prompt: "What is your name?"
  
  - display: "Hello, {{ name | title_case }}!"
  
  - display: |
  
    Let's generate a simple Java class...
  
    We'll begin by prompting for the name of our class, and then create variables in different casings as needed
    in our template.
  
  - set:
    class:
    prompt: "What is the name of your class?"
  
    ClassName:
    value: "{{ class | pascal_case }}"
  
    className:
    value: "{{ class | camel_case }}"
  
  - info: "Our PascalCased class name is '{{ ClassName }}'"
  - debug: "Our camelCased field name is '{{ className }}'"
  
  
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
