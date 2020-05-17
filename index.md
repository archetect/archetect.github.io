Archetect is a powerful, language agnostic, enterprise ready content generator capable of rendering files, projects, 
and entire architectures. Like Maven Archetypes, but with easier authoring and publishishing, like cookiecutter,
but more powerful, and like Yeoman, but easier to use.

## Getting started

### Archetect CLI

You can get a binary of the `archetect` command line tool [here](https://github.com/archetect/archetect/releases).

We are going to be using some basic features available in Archetect to get started on writing a template. 
Running `archetect -h` will get you the help menu for the available commands.

### Building your first project template


#### Archetect definition
Create a new directory and add a `archetype.yml` file. This is the central file to specify all parameters required
for your project template. Copy the following to get started

```
description: "An ExpressJS archetype"
authors: ["Niranjan B Prithviraj <niranjan.prithviraj@gmail.com"]
languages: ["NodeJS"]
frameworks: ["ExpressJS"]
tags: ["Web Server"]

script:
  - set:
      name:
        prompt: 'Application Name: '
      author_full:
        prompt: 'Full Author: '
      description:
        prompt: 'App description: '

  - render:
      directory:
        source: "contents"
```

Our sample project template will use three basic variables.
When creating a project `archetect` CLI use the above definition to prompt the user for

- `name` :  A project name using the string `Application Name:`.
- `author_full` : Full name of the author using the string `Full Author:`
- `description` : A brief description of the project using the string `App description:`

#### Project contents
Create a directory called `contents`. This will house all your project files and directories. 

Now the variables used in `archetect.yml` can be used as templating variables in your project templates.

- Inside the `contents` directory, create a directory called `{{name}}`.

- Inside `{{name}}` create a sample `index.js` file and add the following contents.
```$xslt
/**
 * {{name}}
 * {{description}}
 * {{author_full}}
 */
```

- Add a `.gitignore` file, relevant to your project language, for good measure.

At this point your project template directory should look like this.
```$xslt
|____contents
| |____{{name}}
| | |____index.js
|____archetype.yml
|____.gitignore
```

That is all you need to start off with a template.

#### Generating projects

The `archetect` CLI's `render` sub-command will generate projects based off of your template.
```$xslt
./archetect render <project-template-dir>
```