---
sidebar_position: 2
---

# Template Fundamentals

Learn the core concepts and basic syntax for creating effective templates in Archetect. This section covers template file organization, processing rules, and essential template syntax patterns.

## Template Files and Organization

Templates are regular files with embedded Jinja2-compatible syntax. Archetect processes these files during generation, replacing variables and executing template logic.

```
archetype/
├── archetype.yaml
├── archetype.rhai
└── content/                     # Template root (configurable)
    └── {{ project_name }}/      # Root project directory with variable name
        ├── src/
        │   ├── main.rs       # Template file
        │   ├── lib.rs              # Regular file (copied as-is)
        │   └── {{module_name}}/    # Dynamic directory name
        │       └── mod.rs
        ├── tests/
        │   └── {{project_name}}_test.rs
        ├── Cargo.toml
        └── README.md
```

## File Processing Rules

Understanding how Archetect processes different types of files is crucial for effective template development:

### 1. Template Files
All files in template directories are processed as templates by default. The Template Engine scans each file for template syntax and processes any variables, conditionals, or loops found within.

### 2. Regular Files
Files without template syntax are copied directly to the output location without modification. This is useful for binary files, images, or static configuration files.

### 3. Dynamic Names
File and directory names can contain template syntax, allowing you to create dynamic project structures based on user inputs.

### 4. Conditional Inclusion
Files can be conditionally included or excluded via scripts, giving you fine-grained control over what gets generated.

## Basic Template Syntax

Archetect uses Jinja2-compatible syntax for templates. Here are the fundamental syntax patterns:

### Comments
```jinja
{# This is a comment - won't appear in output #}
{# Comments can span
   multiple lines #}
```

### Variables
```jinja
{# Simple variable replacement #}
Project: {{ project_name }}
Author: {{ author.name }}

{# Accessing nested properties #}
Email: {{ author.email }}
Organization: {{ author.organization.name }}
```

### Expressions and Filters
```jinja
{# Apply filters to transform values #}
Package: {{ project_name | kebab_case }}
Class: {{ project_name | pascal_case }}
Constant: {{ project_name | upper_case | snake_case }}

{# Chain multiple filters #}
Filename: {{ module_name | snake_case | lower }}
```

### Conditionals
```jinja
{# Simple conditional #}
{% if include_tests %}
[dev-dependencies]
test-framework = "1.0"
{% endif %}

{# Complex conditionals with else #}
{% if database_type == "postgresql" %}
use sqlx::PgPool;
{% elif database_type == "mysql" %}
use sqlx::MySqlPool;
{% else %}
use sqlx::SqlitePool;
{% endif %}
```

### Loops
```jinja
{# Simple loop #}
{% for feature in features %}
  - {{ feature }}
{% endfor %}

{# Loop with access to loop variables #}
{% for endpoint in api_endpoints %}
  {{ loop.index }}. {{ endpoint.name }}
  {% if not loop.last %},{% endif %}
{% endfor %}

{# Loop over key-value pairs #}
{% for key, value in configuration %}
{{ key }}: {{ value }}
{% endfor %}
```

## Built-in Filters

Archetect provides several built-in filters for common case transformations:

### Case Conversion Filters
```jinja
{# Convert to different case formats #}
{{ "hello world" | snake_case }}      {# hello_world #}
{{ "hello world" | kebab_case }}      {# hello-world #}
{{ "hello world" | pascal_case }}     {# HelloWorld #}
{{ "hello world" | camel_case }}      {# helloWorld #}
{{ "hello world" | upper_case }}      {# HELLO WORLD #}
{{ "hello world" | lower_case }}      {# hello world #}
```

### Other Useful Filters
```jinja
{# Default values #}
{{ description | default("A generated project") }}

{# String operations #}
{{ project_name | length }}
{{ features | join(", ") }}
{{ text | trim }}
```

## Variable Scope and Context

Understanding variable scope helps you write more effective templates:

### Global Variables
Variables set in your archetype configuration or scripts are available in all templates:

```jinja
{# Available everywhere #}
Project: {{ project_name }}
Author: {{ author_name }}
```

### Template-Local Variables
You can define variables within templates for reuse:

```jinja
{# Define local variables #}
{% set snake_name = project_name | snake_case %}
{% set pascal_name = project_name | pascal_case %}

{# Use throughout the template #}
use {{ snake_name }}::{{ pascal_name }};

impl {{ pascal_name }} {
    // ...
}
```

### Loop Variables
Special variables available within loops:

```jinja
{% for item in items %}
  Index: {{ loop.index }}      {# 1-based index #}
  Index0: {{ loop.index0 }}    {# 0-based index #}
  First: {{ loop.first }}      {# true for first iteration #}
  Last: {{ loop.last }}        {# true for last iteration #}
  Length: {{ loop.length }}    {# total number of iterations #}
{% endfor %}
```

## Error Handling

Handle missing variables and invalid values gracefully:

```jinja
{# Check if variable exists #}
{% if project_name is defined %}
Project: {{ project_name }}
{% else %}
Project: default-project
{% endif %}

{# Provide defaults #}
{{ description | default("No description provided") }}

{# Conditional content based on variable presence #}
{% if author is defined and author.email %}
Author: {{ author.name }} <{{ author.email }}>
{% endif %}
```

## Best Practices

### 1. Use Meaningful Variable Names
```jinja
{# Good: Clear and descriptive #}
{{ database_connection_string }}
{{ user_authentication_method }}

{# Avoid: Ambiguous or abbreviated #}
{{ db_conn }}
{{ auth }}
```

### 2. Organize Complex Logic
```jinja
{# Pre-calculate complex expressions #}
{% set is_web_project = features contains "web" %}
{% set needs_database = features contains "database" %}

{% if is_web_project and needs_database %}
// Web project with database
{% endif %}
```

### 3. Comment Complex Templates
```jinja
{# Generate API endpoints based on user configuration #}
{% for endpoint in api_endpoints %}
  {# Create route handler for {{ endpoint.method }} {{ endpoint.path }} #}
  app.{{ endpoint.method | lower }}("{{ endpoint.path }}", handlers::{{ endpoint.handler }});
{% endfor %}
```

This foundation will help you create effective templates that are maintainable, readable, and robust.