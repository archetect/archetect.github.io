# Basics: Step by Step

Let's begin making our first archetype, step by step, building up concepts as we go.

## Creating our Script

Archetect gets it's instructions from a configuration file containing a simple, domain-specific scripting language.

Create a directory to start your archetype in. Then, create a YAML file at the root of this directory.  For now, let's 
call it `script.yml`:

```yaml
{{#include basics_code.md:step_01}}
```

Within this directory, we can 'render' this script as follows:

```shell
archetect render script.yml
```

Printing "Hello, World!" is fine and dandy, but not particularly interesting.  Modify our script to look as follows:

```yaml
{{#include basics_code.md:step_02}}
```

If we have Archetect render the script as we did above, you will now be prompted to enter a name before displaying our
custom greeting to the screen.

## Using Functions

With our initial script, the `name` variable implies a proper noun.  But currently, nothing stops someone using the 
script from entire in any of the following:

* jane
* JANE
* jane doe
* janeDoe
* jane-doe
* JANE_DOE
* JANE DOE

Archetect makes it easy for archetype authors to accept inputs any way a user wants to provide them, providing all 
the tools necessary to reshape the inputs as needed based on the context where the inputs will be used.

Let's update our script so that our input is piped through a function, `title_case`, which will reshape the input to 
ensure our welcome message is formatted correctly.  Use Archetect to render the script multiple times using the 
example inputs listed above.  Also, try entering in an empty string to see what happens. 

```yaml
{{#include basics_code.md:step_03}}
```


