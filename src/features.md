# Archetect Features

Archetect was designed specifically with these goals in mind:

* Language Agnostic
* Easy to Author archetypes
* Easy to Publish archetypes
* Easy to Use archetypes
* Usable within an Enterprise Environment

To meet these goals, Archetect has some core features unique amongst content generators.

## Templating

Archetect leverages a Jinja2-like templating engine for generating content, with some unique extensions that make it
easy to achieve common templating task without the need for custom scripting.

### Smart Casing Functions

If an archetype author requests a consumer of their archetype to supply the name for a project, what happens if input is 
supplied that contains spaces in the name?  How could the author safely use this input as a Java class name, as a field 
name, or a database column name?

Archetect's casing functions are capable of breaking inputs apart based on casing boundaries and reshape in various ways
as needed throughout the archetype:

* `{{ 'Hello World' | snake_case }}`    => hello_world
* `{{ 'Hello World' | camel_case }}`    => helloWorld
* `{{ 'Hello World' | pascal_case }}`   => HelloWorld
* `{{ 'Hello World' | train_case }}`    => hello-world
* `{{ 'Hello World' | constant_case }}` => HELLO_WORLD
* `{{ 'helloWorld' | title_case }}`     => Hello World
* `{{ 'HELLO_WORLD' | train_case }}`    => hello-world

### Smart Pluralization

Most content generators that provide any sort of pluralization capability generally check to see if inputs end with
an 's' or not, and then simply tack one on as necessary. 

Archetect applies correct pluralizations based on the rules of, and 
exceptions to, the English Language.

As an example, if an archetype consumer inputs 'soliloquy' as the name of a new microservice, the archetype author can 
take this input and ensure that a generated REST API has a `GET /soliloquies/` endpoint, with a `Soliloquy` object model.

* `{{ 'soliloquy' | pluralize }}` => soliloquies
* `{{ 'calf' | pluralize }}` => calves
* `{{ 'gas' | pluralize }}` => gases
* `{{ 'tax' | pluralize }}` => taxes
* `{{ 'wife' | pluralize }}` => wives
* `{{ 'cactus' | pluralize }}` => cacti

