# Structuring an Archetype

If you are following along with the [archetect-tutorial](https://github.com/archetect/archetect-tutorial), you can
switch to this section's examples from within the directory where it was check out:

```shell
    git checkout 02_structure
```

Using inline templates within our script is not very practical.  For one, we can only pipe out a single file.  This 
might prove convenient simple bits of JSON, YAML, or SQL, but not for entire projects.  In addition, for 
some programming languages, the file names often correlate to the name of structures within the files themself.  Take 
Java for instance; we have to enter in the name of our class twice (first when prompted by Archetect, and second when 
specifying the file name to pipe to), making this error-prone to ensure these match.

We can do a lot better.

Archetect provides a `render` command that allows us to specify a directory of templates to read files from, or 
another archetype being composed by this archetype.  Not only can we use variables within the templates, but we can 
also use them in the directory and file names themselves.
