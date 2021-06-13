# Some Basics

If you are following along with the [archetect-tutorial](https://github.com/archetect/archetect-tutorial), you can
switch to this section's examples from within the directory where it was check out:

```shell
    git checkout 01_basics
```

Let's begin making our first archetype, step by step, building up concepts as we go.  

## Creating our Script

Archetect gets it's instructions from a configuration file containing a simple, domain-specific scripting language.

Create a directory to start your archetype in. Then, create a YAML file at the root of this directory. For now, let's
call it `script.yml`:

```yaml
{{#include basics_code.md:step_01}}
```

Within this directory, we can 'render' this script as follows:

```shell
archetect render script.yml
```

## Prompting for Input

Printing "Hello, World!" is fine and dandy, but not particularly interesting. Modify our script to look as follows:

```yaml
{{#include basics_code.md:step_02}}
```

If we have Archetect render the script as we did above, you will now be prompted to enter a name before displaying our
custom greeting to the screen.

## Using Functions

With our initial script, the `name` variable implies a proper noun. But currently, nothing stops someone using the
script from entering in any of the following:

* jane
* JANE
* jane doe
* janeDoe
* jane-doe
* JANE_DOE
* JANE DOE

Archetect makes it easy for archetype authors to accept inputs any way a user might enter them, providing all the tools
necessary to reshape the inputs as needed based on the context where the inputs will be used.

Let's update our script so that our input is piped through a function, `title_case`, which will reshape the input to
ensure our welcome message is formatted correctly. Use Archetect to render the script multiple times using the example
inputs listed above. Also, try entering in an empty string to see what happens.

```yaml
{{#include basics_code.md:step_03}}
```

## Output

In addition to the rendering capabilities we'll begin exploring in [Structuring an Archetype](structure.md), 
Archetect provides multiple ways for outputting to both STDERR and STDOUT. Generally prompts, such as asking for 
input with the `set` action, and informational messages using the `display`, `trace`, `debug`, `info`, `warn`, and 
`error` actions print to STDERR. The `print` action sends output to STDOUT. This provides you tools to design an 
interactive CLI experience, yet allow select output to be piped to a file. Let's start trying these out:

```yaml
{{#include basics_code.md:step_04}}
```

Render the script using Archetect as we've done before, trying various inputs to see how they behave:

```shell
archetect render script.yml
```

Notice that the line corresponding to the `debug` action did not show up. We need to increase the verbosity of output to 
see it by using the -v, or --verbose option.  If we were to have a `trace`, we would need to pass an additional `-v`,
as well.

```shell
archetect render script.yml -v
archetect render script.yml -vv
```

## Putting It Together

The rendering capabilities we'll cover in the next chapter are Archetect's bread and butter, but we can use the tools
provided so far to allow us to interactively generate basic code that we can pipe anywhere.  We could use this to 
generate simple bits of JSON, YAML, SQL, etc.

```yaml
{{#include basics_code.md:step_05}}
```

While actions like `trace`, `debug`, `info`, `warn`, `error`, and `display` all output to `STDERR`, the `print` command
outputs to `STDOUT`.

Render the script to the screen, and then render it to a file.  Use inputs like 'SingletonGreeter', 'singleton
greeter', etc as your input, and notice that your Java code will be rendered correctly in most reasonable cases.

```shell
archetect render script.yml > SingletonGreeter.java
javac SingletonGreeter.java                                                               
java SingletonGreeter
```

Whoa!  Now we're cookin'!

Take notice that for two of the variables defined with the `set` command, we explicitly set their values derived 
from the previously set variable instead of prompting for a value.  These derived variables are in the same shape as 
the casing functions applied. This is a common convention used in Archetect archetypes: take an input, and then create 
multiple variables in the cases required throughout a complex template.  This is much preferable over repeatedly 
using the same functions everywhere, and makes it much easier to author and read the template later!  This practice 
becomes especially important as we start using variables in directory structures.

