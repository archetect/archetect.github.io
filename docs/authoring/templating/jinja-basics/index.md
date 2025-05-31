---
sidebar_position: 1
---

# Jinja Basics

Archetect uses MiniJinja, a Rust implementation of the Jinja2 template engine, to process template files. This section covers the essential Jinja syntax elements you'll use when creating templates.

## Template Syntax Overview

Jinja templates use three types of delimiters to distinguish template code from static text:

- `{{ }}` - **Expressions**: Output values and apply filters
- `{% %}` - **Statements**: Control flow like loops and conditionals  
- `{# #}` - **Comments**: Template documentation (not included in output)

## Variables and Expressions

### Basic Variable Output
```jinja
{{ project_name }}
{{ author_name }}
{{ version }}
```

### Accessing Object Properties
```jinja
{{ author.name }}
{{ author.email }}
{{ project.metadata.description }}
```

### Array/List Access
```jinja
{{ features[0] }}
{{ dependencies[1].name }}
```

## Filters

Filters transform variable values using the pipe (`|`) operator:

### Case Conversion Filters
```jinja
{{ project_name | snake_case }}      {# my_project #}
{{ project_name | kebab_case }}      {# my-project #}
{{ project_name | pascal_case }}     {# MyProject #}
{{ project_name | camel_case }}      {# myProject #}
{{ project_name | upper_case }}      {# MY PROJECT #}
{{ project_name | lower_case }}      {# my project #}
```

### Common Built-in Filters
```jinja
{{ description | default("No description") }}
{{ features | join(", ") }}
{{ project_name | length }}
{{ text | trim }}
{{ name | replace("_", "-") }}
```

### Chaining Filters
```jinja
{{ project_name | snake_case | upper }}
{{ author_name | trim | title }}
```

## Comments

Comments are ignored during template processing:

```jinja
{# This is a single-line comment #}

{# 
   This is a 
   multi-line comment 
#}

{# TODO: Add validation for project_name #}
```

## Conditionals

### Basic If Statements
```jinja
{% if include_tests %}
#[cfg(test)]
mod tests {
    use super::*;
}
{% endif %}
```

### If-Else Statements
```jinja
{% if license == "MIT" %}
// MIT License
{% else %}
// All rights reserved
{% endif %}
```

### Multiple Conditions (If-Elif-Else)
```jinja
{% if database == "postgresql" %}
use tokio_postgres as database;
{% elif database == "mysql" %}
use mysql_async as database;
{% elif database == "sqlite" %}
use rusqlite as database;
{% else %}
// No database selected
{% endif %}
```

### Complex Conditions
```jinja
{% if features contains "web" and include_auth %}
use actix_web_httpauth::middleware::HttpAuthentication;
{% endif %}

{% if not debug_mode %}
[profile.release]
opt-level = 3
{% endif %}
```

## Loops

### Basic For Loops
```jinja
{% for feature in features %}
- {{ feature }}
{% endfor %}
```

### Looping with Index
```jinja
{% for dependency in dependencies %}
{{ loop.index }}. {{ dependency.name }} = "{{ dependency.version }}"
{% endfor %}
```

### Key-Value Iteration
```jinja
{% for key, value in configuration %}
{{ key }} = "{{ value }}"
{% endfor %}
```

### Loop Variables
Special variables available within loops:

```jinja
{% for item in items %}
Index: {{ loop.index }}        {# 1-based index #}
Index0: {{ loop.index0 }}      {# 0-based index #}
First: {{ loop.first }}        {# true on first iteration #}
Last: {{ loop.last }}          {# true on last iteration #}
Length: {{ loop.length }}      {# total iterations #}
{% endfor %}
```

### Loop with Conditions
```jinja
{% for endpoint in api_endpoints %}
{% if endpoint.method == "GET" %}
app.get("{{ endpoint.path }}", handlers::{{ endpoint.handler }});
{% endif %}
{% endfor %}
```

## Variable Assignment

Define variables within templates:

```jinja
{% set snake_name = project_name | snake_case %}
{% set pascal_name = project_name | pascal_case %}

pub struct {{ pascal_name }} {
    name: String,
}

impl {{ pascal_name }} {
    pub fn new() -> Self {
        Self {
            name: "{{ snake_name }}".to_string(),
        }
    }
}
```

## Whitespace Control

Control whitespace around template tags:

```jinja
{# Remove whitespace before tag #}
{% for item in items -%}
{{ item }}
{%- endfor %}

{# Remove whitespace after tag #}
{%- if condition -%}
content
{%- endif -%}
```

## Testing Variables

Check variable existence and values:

```jinja
{% if project_name is defined %}
Project: {{ project_name }}
{% endif %}

{% if description is not defined %}
{% set description = "Default description" %}
{% endif %}

{% if features is empty %}
No features selected
{% endif %}
```

## Expressions and Operators

### Comparison Operators
```jinja
{% if version >= "1.0" %}
{% if status == "active" %}
{% if count != 0 %}
{% if name in allowed_names %}
```

### Logical Operators
```jinja
{% if feature_a and feature_b %}
{% if debug or verbose %}
{% if not production %}
```

### Mathematical Operations
```jinja
{{ total + tax }}
{{ count * price }}
{{ (width * height) / 2 }}
```

## Best Practices

### Use Meaningful Variables
```jinja
{# Good #}
{% if include_authentication %}
{% if database_connection_required %}

{# Avoid #}
{% if auth %}
{% if db %}
```

### Pre-calculate Complex Expressions
```jinja
{% set is_web_app = features contains "web" %}
{% set needs_database = features contains "database" %}
{% set is_full_stack = is_web_app and needs_database %}

{% if is_full_stack %}
// Full-stack web application setup
{% endif %}
```

### Comment Complex Logic
```jinja
{# Generate dependency configuration based on selected features #}
{% for feature in features %}
  {# Each feature may require specific dependencies #}
  {% if feature == "web" %}
actix-web = "4.0"
  {% elif feature == "database" %}
sqlx = "0.7"
  {% endif %}
{% endfor %}
```

This covers the core Jinja syntax you'll use in Archetect templates. The template engine processes these constructs to generate dynamic content based on your archetype configuration and user inputs.