# Archetect

Archetect is a powerful content and code generation tool, with the ability to generate files, projects, or entire architectures.

Archetect is similar to Java's [Maven Archetypes](https://maven.apache.org/guides/introduction/introduction-to-archetypes.html), JavaScript's [yeoman](https://yeoman.io/), and Python's [cookiecutter](https://cookiecutter.readthedocs.io).  These are all powerful content generators in their own right, each with their own strengths and weaknesses. Archetect endeavors to take the best aspects of each, and make something greater than the sum of their parts.

Below are some of the specific and key goals and motivations behind the making of Archetect.

## Language Agnostic

Unlike some code generators, Archetect does not favor any target programming language.  It has a simple but powerful [yaml](https://yaml.org/) based configuration language, and uses a [Jinja 2](https://jinja.palletsprojects.com) style templating language.  There is no way to script templates with JavaScript or Python.  The hard parts of template authoring are baked right into the feature set.

## Easy to Use

Generating a project from an archetype hosted in a remote git repo is as easy as:

```shell script
archetect render git@github.com:archetect/archetype-rust-cli.git
```

No need to install a template locally.  No need to guess parameters required to feed the template.  No need to guess whether the template author is hoping you'll type in answers that are camelCased, PascalCased, or train-cased. It can be run interactively, or completely headless, online or off.

## Easy Authoring and Publishing

Archetect archetypes are simple directories.  No special conventions are enforced, and you're free to organize your archetypes as simply or as sophisticated as you'd like.  Making your fancy archetype available for anyone to use is as simple as publishing it as a git repository. 

## Low Barrier to Entry

Archetect is a native binary written in the [Rust](https://www.rust-lang.org/) programming language, depending on nothing more than your local git binary and setup.  Binaries are available for OSX, Linux, and Windows.  No need to have the right version of Python and libraries installed.  No need to install NodeJS/NPM.  No need to install a JVM.  It can run on your laptop, or within a CI/CD pipeline.