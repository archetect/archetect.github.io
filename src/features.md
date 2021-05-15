# Archetect Features

Archetect was designed specifically with these goals in mind:

* Language Agnostic
* Easy to Author archetypes
* Easy to Publish archetypes
* Easy to Use archetypes
* Usable within an Enterprise Environment

To meet these goals, Archetect has some core features which are fairly unique amongst content generators.

## Smart Casing Functions

Archetect's templating [Tera](https://github.com/Keats/tera), a Jinja2-like templating engine.  Smart casing functions 
have been added that make it trivial to convert inputs from any casing shape to any other casing shape.

* `{{ 'Hello World' | snake_case }}`    => hello_world
* `{{ 'Hello World' | camel_case }}`    => helloWorld
* `{{ 'Hello World' | pascal_case }}`   => HelloWorld
* `{{ 'Hello World' | train_case }}`    => hello-world
* `{{ 'Hello World' | constant_case }}` => HELLO_WORLD
* `{{ 'helloWorld' | title_case }}`     => Hello World
* `{{ 'HELLO_WORLD' | train_case }}`    => hello-world

## Smart Pluralization and Singularization

Most content generators that provide any kind of pluralization capability generally check to see if your input ends with
and 's' or not, and adds one if it's missing. Archetect is a capable of applying correct pluralizations and singularizations
based on the rules and exceptions of the English Language.

* `{{ 'soliloquy' | pluralize }}` => soliloquies
* `{{ 'calf' | pluralize }}` => calves
* `{{ 'gas' | pluralize }}` => gases
* `{{ 'tax' | pluralize }}` => taxes
* `{{ 'wife' | pluralize }}` => wives