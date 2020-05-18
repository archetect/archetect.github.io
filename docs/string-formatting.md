#String formatting

Archetect allows a variety of string formatting options to support a number of language conventions.

## Case formatting

- pascal_case 
- title_case
- camel_case
- constant_case
- snake_case
- train_case

## Advanced options

### Pluralize
pluralize based on all kinds of crazy english rules. {{ 'soliloquy' | pluralize }} = soliloquies; {{ 'tax' | pluralize }} = taxes. {{ 'lilly' | pluralize }} = lillies. {{ 'deer' | pluralize }} = deer.

## Chaining formatting filters

```aidl
{{ project_name | title_case | singularize }} = Tax
```
