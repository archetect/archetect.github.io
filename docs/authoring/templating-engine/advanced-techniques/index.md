---
sidebar_position: 3
---

# Advanced Techniques

Master advanced templating features to create sophisticated, flexible, and powerful archetypes. This section covers template inheritance, dynamic template selection, complex data manipulation, and advanced control flow patterns.

## Template Inheritance

Template inheritance allows you to create base templates that can be extended by other templates, promoting code reuse and maintaining consistency across your archetype.

### Base Template Creation

Create reusable base templates with blocks that can be overridden:

```jinja
{# includes/base_module.rs #}
{% include "includes/license_header" %}

//! {{ module.description }}

{% block imports %}
// Default imports
{% endblock %}

{% block types %}
// Default types
{% endblock %}

{% block implementation %}
// Default implementation
{% endblock %}

{% block tests %}
#[cfg(test)]
mod tests {
    use super::*;
    
    {% block test_cases %}
    #[test]
    fn it_works() {
        assert!(true);
    }
    {% endblock %}
}
{% endblock %}
```

### Extending Base Templates

Extend base templates and override specific blocks:

```jinja
{# src/models/user.rs #}
{% extends "includes/base_module.rs" %}

{% block imports %}
use serde::{Deserialize, Serialize};
use uuid::Uuid;
{% endblock %}

{% block types %}
#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub name: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}
{% endblock %}

{% block implementation %}
impl User {
    pub fn new(email: String, name: String) -> Self {
        Self {
            id: Uuid::new_v4(),
            email,
            name,
            created_at: chrono::Utc::now(),
        }
    }
}
{% endblock %}

{% block test_cases %}
{{ super() }}

#[test]
fn test_user_creation() {
    let user = User::new("test@example.com".to_string(), "Test User".to_string());
    assert_eq!(user.email, "test@example.com");
    assert_eq!(user.name, "Test User");
}
{% endblock %}
```

### Multi-Level Inheritance

Create inheritance hierarchies for complex template structures:

```jinja
{# includes/base.rs - Root base template #}
{% include "includes/license_header" %}
{% block module_doc %}//! Base module{% endblock %}
{% block content %}{% endblock %}

{# includes/service_base.rs - Service-specific base #}
{% extends "includes/base.rs" %}
{% block module_doc %}//! Service module{% endblock %}
{% block content %}
{% block imports %}{% endblock %}
{% block service_struct %}{% endblock %}
{% block service_impl %}{% endblock %}
{% endblock %}

{# src/services/user_service.rs - Concrete implementation #}
{% extends "includes/service_base.rs" %}
{% block module_doc %}//! User management service{% endblock %}
{% block imports %}
use crate::models::User;
use crate::database::Database;
{% endblock %}
```

## Dynamic Template Selection

Use variables and conditions to dynamically select template content based on user inputs or archetype configuration.

### Conditional Template Content

```jinja
{# src/database/mod.rs #}
{% include "shared/license_header" %}

//! Database module for {{ project_name }}

{% if database_type == "postgresql" %}
use sqlx::PgPool as DbPool;
use sqlx::postgres::PgPoolOptions;

pub type Database = PgPool;

pub async fn connect(database_url: &str) -> Result<Database, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await
}
{% elif database_type == "mysql" %}
use sqlx::MySqlPool as DbPool;
use sqlx::mysql::MySqlPoolOptions;

pub type Database = MySqlPool;

pub async fn connect(database_url: &str) -> Result<Database, sqlx::Error> {
    MySqlPoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await
}
{% elif database_type == "sqlite" %}
use sqlx::SqlitePool as DbPool;
use sqlx::sqlite::SqlitePoolOptions;

pub type Database = SqlitePool;

pub async fn connect(database_url: &str) -> Result<Database, sqlx::Error> {
    SqlitePoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await
}
{% endif %}
```

### Template Inclusion Based on Variables

```jinja
{# src/main.rs #}
{% include "includes/license_header" %}

use std::error::Error;

{% if include_logging %}
{% include "includes/logging_setup" %}
{% endif %}

{% if include_config %}
{% include "includes/config_management" %}
{% endif %}

fn main() -> Result<(), Box<dyn Error>> {
    {% if include_logging %}
    init_logging()?;
    {% endif %}
    
    {% if include_config %}
    let config = load_config()?;
    {% endif %}
    
    // Application logic
    Ok(())
}
```

### Dynamic File Selection

Use scripting to conditionally include entire files:

```rhai
// In archetype.rhai
if database_type == "postgresql" {
    include_file("src/database/postgresql.rs", "src/database/mod.rs");
} else if database_type == "mysql" {
    include_file("src/database/mysql.rs", "src/database/mod.rs");
} else {
    include_file("src/database/sqlite.rs", "src/database/mod.rs");
}
```

## Complex Data Structures

Work effectively with complex nested data structures in your templates.

### Nested Object Access

```jinja
{# src/api/routes.rs #}
{% include "shared/license_header" %}

use axum::{Router, routing::{get, post, put, delete}};
use crate::handlers;

pub fn create_router() -> Router {
    Router::new()
{% for endpoint in api_endpoints %}
        {% set method = endpoint.method | lower %}
        {% set path = endpoint.path %}
        {% set handler = endpoint.handler | snake_case %}
        .route("{{ path }}", {{ method }}(handlers::{{ handler }}))
{% endfor %}
}

// Handler modules
{% for endpoint in api_endpoints %}
    {% set module_name = endpoint.handler | snake_case %}
    {% if loop.first or endpoint.handler != api_endpoints[loop.index0-1].handler %}
pub mod {{ module_name }};
    {% endif %}
{% endfor %}
```

### Complex Iteration Patterns

```jinja
{# src/models/mod.rs #}
{% for model in data_models %}
pub mod {{ model.name | snake_case }};
{% endfor %}

{% for model in data_models %}
    {% if model.relationships %}
        {% for relationship in model.relationships %}
            {% if relationship.type == "belongs_to" %}
// {{ model.name }} belongs to {{ relationship.target }}
            {% elif relationship.type == "has_many" %}
// {{ model.name }} has many {{ relationship.target }}
            {% endif %}
        {% endfor %}
    {% endif %}
{% endfor %}
```

### Conditional Complex Logic

```jinja
{# src/config/database.rs #}
{% set has_read_replica = database.read_replica is defined %}
{% set has_write_db = database.write_db is defined %}
{% set connection_pooling = database.pool is defined and database.pool.enabled %}

#[derive(Debug, Clone)]
pub struct DatabaseConfig {
    {% if has_write_db %}
    pub write_url: String,
    {% endif %}
    {% if has_read_replica %}
    pub read_url: String,
    {% endif %}
    {% if connection_pooling %}
    pub pool_size: u32,
    pub timeout: Duration,
    {% endif %}
}

impl DatabaseConfig {
    pub fn new() -> Self {
        Self {
            {% if has_write_db %}
            write_url: env::var("DATABASE_WRITE_URL").expect("DATABASE_WRITE_URL must be set"),
            {% endif %}
            {% if has_read_replica %}
            read_url: env::var("DATABASE_READ_URL").expect("DATABASE_READ_URL must be set"),
            {% endif %}
            {% if connection_pooling %}
            pool_size: {{ database.pool.size | default(10) }},
            timeout: Duration::from_secs({{ database.pool.timeout | default(30) }}),
            {% endif %}
        }
    }
}
```

## Advanced Control Flow

### Macro Definitions

Create reusable template macros for complex logic:

```jinja
{# includes/macros.rs #}
{% macro generate_crud_methods(model) %}
impl {{ model.name | pascal_case }} {
    pub async fn create(db: &Database, data: Create{{ model.name | pascal_case }}) -> Result<Self, DatabaseError> {
        // Create implementation
    }
    
    pub async fn find_by_id(db: &Database, id: {{ model.id_type | default("i32") }}) -> Result<Option<Self>, DatabaseError> {
        // Find implementation
    }
    
    pub async fn update(db: &Database, id: {{ model.id_type | default("i32") }}, data: Update{{ model.name | pascal_case }}) -> Result<Self, DatabaseError> {
        // Update implementation
    }
    
    pub async fn delete(db: &Database, id: {{ model.id_type | default("i32") }}) -> Result<(), DatabaseError> {
        // Delete implementation
    }
}
{% endmacro %}

{% macro generate_validators(model) %}
{% for field in model.fields %}
    {% if field.validators %}
        {% for validator in field.validators %}
pub fn validate_{{ field.name }}(value: &{{ field.type }}) -> Result<(), ValidationError> {
            {% if validator.type == "length" %}
    if value.len() < {{ validator.min }} || value.len() > {{ validator.max }} {
        return Err(ValidationError::new("{{ field.name }}_length"));
    }
            {% elif validator.type == "regex" %}
    if !Regex::new(r"{{ validator.pattern }}").unwrap().is_match(value) {
        return Err(ValidationError::new("{{ field.name }}_format"));
    }
            {% endif %}
    Ok(())
}
        {% endfor %}
    {% endif %}
{% endfor %}
{% endmacro %}
```

### Using Macros

```jinja
{# src/models/user.rs #}
{% include "includes/macros.rs" %}

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: i32,
    pub email: String,
    pub name: String,
}

{{ generate_crud_methods(user_model) }}
{{ generate_validators(user_model) }}
```

### Advanced Filtering and Transformation

```jinja
{# src/api/handlers.rs #}
{% set authenticated_endpoints = api_endpoints | selectattr("requires_auth", "equalto", true) %}
{% set public_endpoints = api_endpoints | rejectattr("requires_auth", "equalto", true) %}

// Public endpoints
{% for endpoint in public_endpoints %}
pub async fn {{ endpoint.handler | snake_case }}() -> impl IntoResponse {
    // Public handler
}
{% endfor %}

// Authenticated endpoints
{% for endpoint in authenticated_endpoints %}
pub async fn {{ endpoint.handler | snake_case }}(
    auth: AuthUser,
) -> impl IntoResponse {
    // Authenticated handler
}
{% endfor %}
```

## Whitespace Control

Control whitespace and formatting in generated code for clean output:

```jinja
{# Trim whitespace with - #}
{% for item in items -%}
    {{ item }}
{%- endfor %}

{# Preserve intentional formatting #}
{% for dependency in dependencies %}
{{ dependency.name }} = "{{ dependency.version }}"
{% endfor %}

{# Remove blank lines in lists #}
{% for field in fields -%}
    {{ field.name | snake_case }}: {{ field.type | rust_type }},
{% endfor %}

{# Complex whitespace control #}
impl {{ struct_name }} {
{%- for method in methods %}
    {{ method.visibility }} fn {{ method.name }}(
        {%- for param in method.parameters -%}
            {%- if not loop.first %}, {% endif -%}
            {{ param.name }}: {{ param.type }}
        {%- endfor -%}
    ) -> {{ method.return_type }} {
        // Method implementation
    }
{% endfor -%}
}
```

These advanced techniques enable you to create sophisticated, maintainable, and powerful templates that can handle complex generation scenarios while maintaining clean, readable code.