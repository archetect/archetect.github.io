# Structuring an Archetype

Using inline templates within our script is not very practical.  For once, we can only pipe out one file.  Second, 
in the case of our example, we have to enter in the name of our class twice (one when prompted by Archetect, and two 
when specify the file name to pipe to), making error-prone to ensure these match.

We can do a lot better.

Archetect provides a `render` command that allows us to specify a directory of templates to read files from, or 
another archetype being composed by this archetype.
