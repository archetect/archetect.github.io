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

Archetect provides a `render` action that allows us to specify a directory of templates to read files from, or 
another archetype being composed by this archetype.  Not only can we use variables within the templates, but we can 
also use them in the directory and file names themselves.

## Refactoring

So far, we've been rendering the `script.yml` file.  However, Archetypes are usually contained within a directory or
Git repository, and we can't always specify the name of a script to render.

Instead, we generally specify the path to a directory or the git URL.  By convention, Archetect looks for either 
`archetype.yml` or `archetype.yaml` at the root of the directory.  Let's fix this:

```shell
mv script.yml archetect.yml
```

Now, we will instead specify the directory to render instead of the YAML file:

```shell
archetect render ./
```

Now, let's create a directory to store our templates in, and move our Java template into a file within:

```shell
mkdir contents
touch "contents/{{ ClassName }}.java"
```

Copy and paste the Java class from our initial script into the new file, and format it appropriately:

```java
public class {{ ClassName }} {
    private static {{ ClassName }} {{ className }} = new {{ ClassName }}();
    
    private {{ ClassName }}(){}
    
    public static {{ ClassName }} getInstance(){
        return {{ className }};
    }
    
    public void printMessage() {
        System.out.println("This is a contrived example. You can try this at home... but don't try it at work!");
    }
    
    public static void main(String[] args) {
        {{ ClassName }}.getInstance().printMessage();
    }
}
```

With these changes, we can reformat our `archetype.yml` file to make use of our new templates directory:

```yaml
---
script:

  - set:
      class:
        prompt: "What is the name of your class?"

      ClassName:
        value: "{{ class | pascal_case }}"

      className:
        value: "{{ class | camel_case }}"

  - render:
      directory:
        source: contents
```

Our directory is now becoming an archetype, and something we'll eventually check into revision control.  We 
don't want to pollute our archetype with generated files. Therefore, we should start rendering into a different 
directory.  As an example, if we had `~/projects/` and`~/archetypes/` directories, where the former is where we render 
our projects and the latter is where we author our archetypes, we would now render as follows:

```shell
cd ~/projects/
archetect render ~/archetypes/archetect-tutorial
```

We no longer need to pipe our output to a file, and whatever we supply as our class name will now be reflected in the
file name, as well.  Easy!
                                                
