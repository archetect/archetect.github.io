# Structuring an Archetype

Using inline templates within our script is not very practical.  For one, we can only pipe out one file.  This 
might prove convenient to generate a single bit of JSON, YAML, or SQL.  For programming languages, the file names 
often correlate to the name of structures in the file itself.  Take Java for instance; we have to enter in the name of 
our class twice (first when prompted by Archetect, and second when specifying the file name to pipe to), making this 
error-prone to ensure these match.

We can do a lot better.

Archetect provides a `render` command that allows us to specify a directory of templates to read files from, or 
another archetype being composed by this archetype.  Not only can we use variables within the templates, but we can 
also use them in the directory and file names themselves.