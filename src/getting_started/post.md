# Post Configuration

Archetect can get by just fine with little or no configuration. 

However, there are common answers to questions almost any archetype would ask of you.  Things like, "Who's the author of this project?".  You wouldn't want to have to enter that every time, since you're probably not changing your name often.

Also, it's not always convenient to copy and paste the location of an archetype hosted in a git repo.  If you do a lot of prototyping, you may be generating lots of projects from a variety of archetypes, and it would be handy to have a menu of archetypes available.

Luckily, Archetect has solutions for both of these problems, but you'll need to apply a little bit of configuration to get them.  Archetect wouldn't be much of a content generator if it couldn't generate its own configuration files!

## Generating your Configuration

Provided you've followed all of the steps so far, lets generate that configuration using Archetect itself!

```shell script
archetect render git@github.com:archetect/archetect-initializer.git ~/.archetect/
```

You should see something like the following:

```shell script 
archetect: Pulling git@github.com:archetect/archetect-initializer.git
What is your first name? Jimmie
What is your last name? Fulton
What is your email address? jimmie.fulton@spammail.com
```

What happened?  The `archetect render` command pulled `git@github.com:archetect/archetect-initializer.git` into a local cache, and used the archetype configuration and templates within to generate the contents of the newly created `~/.archetect` directory.

Let's take a peek at one of the files that was generated, shall we?

```shell script
cat ~/.archetect/etc/answers.yml
```

This file contains answers to questions archetype authors might use within their templates.  If they use the same variable names you have listed in your answers file, you won't be prompted for those specific questions.  Your answers.yml file should look at lot like this:

```yaml
---
answers:
  author:
    value: "Jimmie Fulton"

  author_full:
    value: "Jimmie Fulton"

  author_email:
    value: "jimmie.fulton@spammail.com"

  author_long:
    value: "Jimmie Fulton <jimmie.fulton@spammail.com>"

  author_short:
    value: "jfulton"
```   