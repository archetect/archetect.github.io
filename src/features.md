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

## Configuration

In the simplest case, an archetype is nothing more than a directory with an archetype.yml file at the root.  This file 
is a templating-aware DSL for describing how to acquire inputs, either interactively or through answer parameters of files, 
and how to render templated content based on those inputs.

### Conditional Rendering

Archetect does not prescribe a specific directory structure for holding templated content.  Instructions in the archetype.yml
file are used to tell Archetect what to render.  Multiple target template directories can be rendered, conditionally if
desired, allowing for projects to be generated with features as determined based on the inputs acquired from the consumer 
of an archetype.

### Composition

Archetypes not only can refer to one or more directories to render, but also other archetypes.  This can allow for 
interesting compositions.  As examples:

* Having a common foundational archetype that contains content that should be rendered in all other archetypes, while 
  avoiding duplications and maintenance across multiple archetypes.
* Having different archetypes for various remoting and database layers, and using conditional rendering to mix and match
  these technologies in various combinations.  For instance, a composting archetype could ask "What kind of remoting
  layer would you like? [gRPC, OpenAPI, Thrift, Hessian]", and "What kind of database layer would you like? 
  [JPA, DynamoDB, Cassandra]".

