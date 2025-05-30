---
sidebar_position: 1
---

# Debugging Templates

Effective template debugging techniques help you identify and resolve issues quickly during development. This section covers debugging strategies, troubleshooting common problems, and tools for analyzing template behavior.

## Debug Output and Logging

### Template Debug Mode

Add debug information to templates during development:

```jinja
{# Enable debug mode via variable #}
{% set debug = debug_mode | default(false) %}

{% if debug %}
{# 
=== TEMPLATE DEBUG INFO ===
Template: {{ __template_name__ | default("unknown") }}
Timestamp: {{ "now" | format_timestamp }}
Variables:
{% for key in __context__.keys() | sort %}
- {{ key }}: {{ __context__[key] | truncate(50) }}
{% endfor %}
=== END DEBUG INFO ===
#}
{% endif %}

//! Generated module for {{ project_name }}

{% if debug %}
// Debug: Processing {{ features | length }} features
{% for feature in features %}
// Debug: Feature {{ loop.index }}/{{ features | length }}: {{ feature }}
{% endfor %}
{% endif %}

use std::collections::HashMap;

{% for feature in features %}
{% if debug %}
// Debug: Generating code for feature: {{ feature }}
{% endif %}
pub mod {{ feature | snake_case }};
{% endfor %}

{% if debug %}
// Debug: Template processing completed successfully
{% endif %}
```

### Conditional Debug Blocks

Create debug sections that can be toggled on/off:

```jinja
{# src/main.rs #}
{% include "includes/license_header" %}

{% if debug_imports %}
{# Debug: Import analysis
{% for import in imports %}
- {{ import.module }}: {{ import.items | join(", ") }}
{% endfor %}
#}
{% endif %}

{% for import in imports %}
use {{ import.module }}::{% if import.items | length == 1 %}{{ import.items[0] }}{% else %}{
    {% for item in import.items %}
    {{ item }}{% if not loop.last %},{% endif %}
    {% endfor %}
}{% endif %};
{% endfor %}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    {% if debug_execution %}
    println!("Debug: Starting application with configuration:");
    {% for key, value in config %}
    println!("  {}: {:?}", "{{ key }}", {{ value }});
    {% endfor %}
    {% endif %}
    
    // Application logic here
    
    {% if debug_execution %}
    println!("Debug: Application completed successfully");
    {% endif %}
    
    Ok(())
}
```

### Variable Inspection

Add comprehensive variable debugging:

```jinja
{# includes/debug_helpers.jinja #}
{% macro debug_var(var_name, var_value) %}
{% if debug_variables %}
{# Debug Variable: {{ var_name }}
   Type: {{ var_value.__class__.__name__ if var_value.__class__ is defined else "unknown" }}
   Value: {{ var_value | string | truncate(100) }}
   Length: {{ var_value | length if var_value is iterable else "not iterable" }}
#}
{% endif %}
{% endmacro %}

{% macro debug_object(obj_name, obj) %}
{% if debug_objects %}
{# Debug Object: {{ obj_name }}
{% if obj is mapping %}
   Properties:
{% for key, value in obj %}
   - {{ key }}: {{ value | string | truncate(50) }}
{% endfor %}
{% elif obj is iterable %}
   Items ({{ obj | length }}):
{% for item in obj[:5] %}
   - {{ loop.index }}: {{ item | string | truncate(50) }}
{% endfor %}
{% if obj | length > 5 %}
   ... and {{ obj | length - 5 }} more
{% endif %}
{% else %}
   Value: {{ obj | string | truncate(100) }}
{% endif %}
#}
{% endif %}
{% endmacro %}
```

Use debug helpers in templates:

```jinja
{# src/config.rs #}
{% include "includes/debug_helpers.jinja" %}

{{ debug_var("project_name", project_name) }}
{{ debug_object("database_config", database) }}
{{ debug_object("features_list", features) }}

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    pub project_name: String,
    {% if database is defined %}
    pub database: DatabaseConfig,
    {% endif %}
}
```

## Progressive Template Testing

### Incremental Development

Test templates step by step during development:

```jinja
{# src/lib.rs.progressive #}
{% set step = build_step | default(1) %}

//! {{ project_name }} library
//! Build step: {{ step }}

{% if step >= 1 %}
// Step 1: Basic structure
pub mod config;
pub mod error;
{% endif %}

{% if step >= 2 %}
// Step 2: Add core modules
{% if features.database %}
pub mod database;
{% endif %}
{% if features.auth %}
pub mod auth;
{% endif %}
{% endif %}

{% if step >= 3 %}
// Step 3: Add advanced features
{% if features.api %}
pub mod api;
{% endif %}
{% if features.metrics %}
pub mod metrics;
{% endif %}
{% endif %}

{% if step >= 4 %}
// Step 4: Add application structure
use config::Config;
{% if features.database %}
use database::DatabasePool;
{% endif %}

pub struct Application {
    config: Config,
    {% if features.database %}
    db_pool: DatabasePool,
    {% endif %}
}
{% endif %}

{% if step >= 5 %}
// Step 5: Implementation
impl Application {
    pub async fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let config = Config::load()?;
        
        {% if features.database %}
        let db_pool = database::create_pool(&config.database).await?;
        {% endif %}
        
        Ok(Self {
            config,
            {% if features.database %}
            db_pool,
            {% endif %}
        })
    }
}
{% endif %}
```

Test each step:

```bash
# Test each build step
archetect render . test-step1 -a build_step=1
archetect render . test-step2 -a build_step=2
archetect render . test-step3 -a build_step=3
```

### Template Validation Points

Add validation checkpoints throughout templates:

```jinja
{# src/models/user.rs #}
{% include "includes/license_header" %}

{# Validation: Check required variables #}
{% if not user_model is defined %}
  {% error "user_model configuration is required" %}
{% endif %}

{% if not user_model.fields is defined %}
  {% error "user_model.fields must be defined" %}
{% endif %}

//! User model for {{ project_name }}

use serde::{Deserialize, Serialize};
{% if user_model.includes_timestamps | default(true) %}
use chrono::{DateTime, Utc};
{% endif %}

{# Validation: Check field definitions #}
{% for field in user_model.fields %}
  {% if not field.name is defined %}
    {% error "Field " + loop.index|string + " is missing 'name' property" %}
  {% endif %}
  {% if not field.type is defined %}
    {% error "Field '" + field.name + "' is missing 'type' property" %}
  {% endif %}
{% endfor %}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    {% for field in user_model.fields %}
    pub {{ field.name | snake_case }}: {{ field.type }},
    {% endfor %}
    {% if user_model.includes_timestamps | default(true) %}
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    {% endif %}
}

{# Validation: Ensure we have at least one field #}
{% if user_model.fields | length == 0 %}
  {% error "User model must have at least one field defined" %}
{% endif %}
```

## Error Handling and Recovery

### Graceful Error Handling

Handle missing or invalid data gracefully:

```jinja
{# src/database/mod.rs #}
{% include "includes/license_header" %}

//! Database module for {{ project_name }}

{% try %}
  {% if database_type == "postgresql" %}
    use sqlx::PgPool as DatabasePool;
    {% set db_feature = "postgres" %}
  {% elif database_type == "mysql" %}
    use sqlx::MySqlPool as DatabasePool;
    {% set db_feature = "mysql" %}
  {% elif database_type == "sqlite" %}
    use sqlx::SqlitePool as DatabasePool;
    {% set db_feature = "sqlite" %}
  {% else %}
    {% error "Unsupported database type: " + database_type %}
  {% endif %}
{% catch %}
  {# Fallback to default database #}
  {% set database_type = "sqlite" %}
  use sqlx::SqlitePool as DatabasePool;
  {% set db_feature = "sqlite" %}
{% endtry %}

use std::env;

pub type Database = DatabasePool;

pub async fn create_pool() -> Result<Database, sqlx::Error> {
    {% try %}
    let database_url = env::var("DATABASE_URL")
        {% if database_type == "sqlite" %}
        .unwrap_or_else(|_| "sqlite://./{{ project_name | snake_case }}.db".to_string());
        {% else %}
        .expect("DATABASE_URL environment variable is required for {{ database_type }}");
        {% endif %}
    {% catch %}
    let database_url = "sqlite://:memory:".to_string();
    {% endtry %}
    
    {% if database_type == "postgresql" %}
    sqlx::postgres::PgPoolOptions::new()
    {% elif database_type == "mysql" %}
    sqlx::mysql::MySqlPoolOptions::new()
    {% else %}
    sqlx::sqlite::SqlitePoolOptions::new()
    {% endif %}
        .max_connections({{ max_connections | default(5) }})
        .connect(&database_url)
        .await
}
```

### Error Context and Reporting

Provide detailed error context:

```jinja
{# src/api/handlers.rs #}
{% include "includes/license_header" %}

{% for endpoint in api_endpoints %}
  {% try %}
    {% set handler_name = endpoint.handler | snake_case %}
    {% set method = endpoint.method | lower %}
    {% set path = endpoint.path %}
    
    {% if not endpoint.handler %}
      {% error "Endpoint " + loop.index|string + " missing handler definition" %}
    {% endif %}
    
    pub async fn {{ handler_name }}(
        {% if endpoint.requires_auth | default(false) %}
        auth: AuthUser,
        {% endif %}
        {% if endpoint.path_params is defined %}
        Path(params): Path<{{ endpoint.path_params.type }}>,
        {% endif %}
        {% if endpoint.body is defined %}
        Json(body): Json<{{ endpoint.body.type }}>,
        {% endif %}
    ) -> Result<Json<{{ endpoint.response.type | default("()") }}>, StatusCode> {
        {% if endpoint.implementation is defined %}
        {{ endpoint.implementation }}
        {% else %}
        // TODO: Implement {{ handler_name }}
        Err(StatusCode::NOT_IMPLEMENTED)
        {% endif %}
    }
    
  {% catch error %}
    {# Log error and provide fallback #}
    // Error generating handler for endpoint {{ loop.index }}: {{ error }}
    // Skipping this endpoint - check configuration
    
  {% endtry %}
{% endfor %}
```

## Template Introspection

### Template Metadata Analysis

Analyze template structure and dependencies:

```jinja
{# includes/template_analysis.jinja #}
{% set template_stats = {
    "variables_used": [],
    "filters_used": [],
    "conditionals": 0,
    "loops": 0,
    "includes": 0
} %}

{% macro track_variable(var_name) %}
  {% set _ = template_stats.variables_used.append(var_name) %}
{% endmacro %}

{% macro track_filter(filter_name) %}
  {% set _ = template_stats.filters_used.append(filter_name) %}
{% endmacro %}

{% macro start_conditional() %}
  {% set template_stats = template_stats.update({"conditionals": template_stats.conditionals + 1}) %}
{% endmacro %}

{% macro start_loop() %}
  {% set template_stats = template_stats.update({"loops": template_stats.loops + 1}) %}
{% endmacro %}

{% macro template_summary() %}
{% if generate_template_stats %}
{# 
=== TEMPLATE ANALYSIS ===
Variables used: {{ template_stats.variables_used | unique | sort | join(", ") }}
Filters used: {{ template_stats.filters_used | unique | sort | join(", ") }}
Conditionals: {{ template_stats.conditionals }}
Loops: {{ template_stats.loops }}
Includes: {{ template_stats.includes }}
Complexity score: {{ (template_stats.conditionals * 2) + (template_stats.loops * 3) + template_stats.includes }}
=== END ANALYSIS ===
#}
{% endif %}
{% endmacro %}
```

Use in templates:

```jinja
{# src/complex_module.rs #}
{% include "includes/template_analysis.jinja" %}

{{ track_variable("project_name") }}
//! {{ project_name }} module

{% for feature in features %}
  {{ start_loop() }}
  {% if feature.enabled %}
    {{ start_conditional() }}
    {{ track_variable("feature.config") }}
    pub mod {{ feature.name | snake_case }};
  {% endif %}
{% endfor %}

{{ template_summary() }}
```

### Dependency Tracking

Track template dependencies and relationships:

```jinja
{# includes/dependency_tracker.jinja #}
{% set dependencies = {
    "required_variables": [],
    "optional_variables": [],
    "included_templates": [],
    "generated_files": []
} %}

{% macro require_var(var_name, description="") %}
  {% set _ = dependencies.required_variables.append({"name": var_name, "description": description}) %}
  {% if not __context__[var_name] is defined %}
    {% error "Required variable '" + var_name + "' is not defined. " + description %}
  {% endif %}
{% endmacro %}

{% macro optional_var(var_name, default_value, description="") %}
  {% set _ = dependencies.optional_variables.append({"name": var_name, "default": default_value, "description": description}) %}
{% endmacro %}

{% macro dependency_report() %}
{% if generate_dependency_report %}
{#
=== TEMPLATE DEPENDENCIES ===

Required Variables:
{% for var in dependencies.required_variables %}
- {{ var.name }}: {{ var.description }}
{% endfor %}

Optional Variables:
{% for var in dependencies.optional_variables %}
- {{ var.name }} (default: {{ var.default }}): {{ var.description }}
{% endfor %}

Included Templates:
{% for template in dependencies.included_templates %}
- {{ template }}
{% endfor %}

=== END DEPENDENCIES ===
#}
{% endif %}
{% endmacro %}
```

## Performance Debugging

### Template Rendering Profiling

Add timing information to identify performance bottlenecks:

```jinja
{# includes/performance_debug.jinja #}
{% macro profile_section(section_name) %}
{% if debug_performance %}
{# Profile: Starting {{ section_name }} at {{ "now" | format_time }} #}
{% endif %}
{% endmacro %}

{% macro profile_end(section_name) %}
{% if debug_performance %}
{# Profile: Completed {{ section_name }} at {{ "now" | format_time }} #}
{% endif %}
{% endmacro %}

{% macro profile_loop_start(loop_name, item_count) %}
{% if debug_performance %}
{# Profile: Starting {{ loop_name }} loop with {{ item_count }} items #}
{% endif %}
{% endmacro %}

{% macro profile_loop_iteration(loop_name, iteration, total) %}
{% if debug_performance and (iteration % 10 == 0 or iteration == total) %}
{# Profile: {{ loop_name }} progress {{ iteration }}/{{ total }} #}
{% endif %}
{% endmacro %}
```

Use in performance-critical templates:

```jinja
{# src/large_module.rs #}
{% include "includes/performance_debug.jinja" %}

{{ profile_section("module_generation") }}

//! Large module with many components

{{ profile_section("imports") }}
{% for import in imports %}
use {{ import }};
{% endfor %}
{{ profile_end("imports") }}

{{ profile_section("models") }}
{{ profile_loop_start("model_generation", models | length) }}
{% for model in models %}
{{ profile_loop_iteration("model_generation", loop.index, models | length) }}

#[derive(Debug)]
pub struct {{ model.name | pascal_case }} {
    // Model fields
}
{% endfor %}
{{ profile_end("models") }}

{{ profile_end("module_generation") }}
```

These debugging techniques help you identify issues quickly, understand template behavior, and optimize performance during development.