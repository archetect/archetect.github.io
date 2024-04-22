# Templating Configuration

Some aspects of the templating engine can be configured through settings in an archetype's `archetype.yaml` manifest.

## Undefined Behavior

Since: 2.0.0-ALPHA.17

`Undefined Behavior` can be tuned based on the needs of an archetype.  This configuration determines what happens if a 
context value is "undefined" (null).  

Archetect's templating engine allows for the following three options:

### Strict (default)

The templating engine will throw an error if an undefined value is encountered.  For most archetypes, this setting is 
suitable, and helps an archetype author identify problems with their archetype quicker.

For example, if a variable `first_name` has not been defined when rending Jinja content, such as:

```
Hello, {{ first_name }}!
```

Archetect will throw an error and abort any further execution of the archetype.

To enable this behavior in `archetype.yaml`:
```yaml
---
templating:
  undefined_behavior: Strict
```

### Lenient
The templating engine will silently insert an empty string if a value is undefined. Useful when generating from more complex
context models where you want to conditionally render content based on whether a variable is defined or not.

For example, if `first_name` has been defined, but `greeting` is optional and possibly undefined:

```jinja
{% if greeting %}{{ greeting }}{% else %}Hello{% endif %}, {{ first_name}}!
```

Archetype will allow the conditional check on `greeting`, and silently insert an empty string for `first_name` if it has
not been defined.

To enable this behavior in `archetype.yaml`:
```yaml
templating:
  undefined_behavior: Lenient
```

### Chainable
The templating engine will silently insert an empty string, even if there are a chain of undefined values. Useful for complex, dynamic generation from models.

For example, if an object with properties is optionally expected in the context, archetype will silently insert an empty
string if either `person` or `person.first_name` is undefined:

```jinja
{{ person.first_name }}
```

To enable this behavior in `archetype.yaml`:
```yaml
templating:
  undefined_behavior: Chainable
```
