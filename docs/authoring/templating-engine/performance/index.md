---
sidebar_position: 5
---

# Performance Optimization

Optimize your templates for better performance with efficient compilation strategies, smart conditional rendering, and best practices that ensure fast generation times even for complex archetypes.

## Template Compilation Optimization

### 1. Pre-calculate Values

Avoid recalculating the same values multiple times within templates:

```jinja
{# Efficient: Pre-calculate values once #}
{% set snake_name = project_name | snake_case %}
{% set pascal_name = project_name | pascal_case %}
{% set kebab_name = project_name | kebab_case %}
{% set upper_name = project_name | upper_case %}

// Use pre-calculated values throughout the template
use {{ snake_name }}::{{ pascal_name }};

impl {{ pascal_name }} {
    pub fn new() -> Self {
        Self {
            name: "{{ kebab_name }}".to_string(),
            constant: {{ upper_name }}_DEFAULT,
        }
    }
}

pub const {{ upper_name }}_DEFAULT: &str = "{{ kebab_name }}";

{# Less efficient: Multiple calculations of the same value #}
use {{ project_name | snake_case }}::{{ project_name | pascal_case }};
impl {{ project_name | pascal_case }} {
    pub fn new() -> Self {
        Self {
            name: "{{ project_name | kebab_case }}".to_string(),
            constant: {{ project_name | upper_case }}_DEFAULT,
        }
    }
}
pub const {{ project_name | upper_case }}_DEFAULT: &str = "{{ project_name | kebab_case }}";
```

### 2. Optimize Complex Expressions

Break down complex expressions into simpler, reusable components:

```jinja
{# Efficient: Break down complex logic #}
{% set has_auth = "auth" in features %}
{% set has_database = "database" in features %}
{% set has_api = "api" in features %}
{% set is_web_app = has_auth and has_api %}
{% set needs_migrations = has_database and database_type != "sqlite" %}

{% if is_web_app %}
// Web application configuration
use axum::Router;
{% if has_auth %}
use crate::auth::AuthLayer;
{% endif %}
{% endif %}

{% if needs_migrations %}
// Database migrations
use sqlx::migrate::MigrateDatabase;
{% endif %}

{# Less efficient: Complex expressions repeated #}
{% if "auth" in features and "api" in features %}
use axum::Router;
{% if "auth" in features %}
use crate::auth::AuthLayer;
{% endif %}
{% endif %}

{% if "database" in features and database_type != "sqlite" %}
use sqlx::migrate::MigrateDatabase;
{% endif %}
```

### 3. Efficient Variable Access

Optimize access to nested variables:

```jinja
{# Efficient: Store nested access in variables #}
{% set author_name = author.name %}
{% set author_email = author.email %}
{% set org_name = author.organization.name %}

// Author: {{ author_name }} <{{ author_email }}>
// Organization: {{ org_name }}

fn get_author_info() -> AuthorInfo {
    AuthorInfo {
        name: "{{ author_name }}".to_string(),
        email: "{{ author_email }}".to_string(),
        organization: "{{ org_name }}".to_string(),
    }
}

{# Less efficient: Repeated nested access #}
// Author: {{ author.name }} <{{ author.email }}>
// Organization: {{ author.organization.name }}

fn get_author_info() -> AuthorInfo {
    AuthorInfo {
        name: "{{ author.name }}".to_string(),
        email: "{{ author.email }}".to_string(),
        organization: "{{ author.organization.name }}".to_string(),
    }
}
```

## Efficient Conditional Rendering

### 1. Group Related Conditionals

Minimize the number of conditional checks by grouping related logic:

```jinja
{# Efficient: Check once, render entire block #}
{% if include_database %}
// Database configuration and related functionality
use sqlx::Pool;
use std::env;

#[derive(Debug, Clone)]
pub struct DatabaseConfig {
    pub url: String,
    pub max_connections: u32,
    pub timeout: Duration,
}

impl DatabaseConfig {
    pub fn new() -> Self {
        Self {
            url: env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
            max_connections: {{ database_pool_size | default(10) }},
            timeout: Duration::from_secs({{ database_timeout | default(30) }}),
        }
    }
    
    pub async fn connect(&self) -> Result<Pool<{{ database_type | title }}>, sqlx::Error> {
        // Connection logic
    }
}

pub type Database = Pool<{{ database_type | title }}>;
{% endif %}

{# Less efficient: Multiple separate checks #}
{% if include_database %}use sqlx::Pool;{% endif %}
{% if include_database %}use std::env;{% endif %}

{% if include_database %}
#[derive(Debug, Clone)]
pub struct DatabaseConfig {
    // ...
}
{% endif %}

{% if include_database %}
impl DatabaseConfig {
    // ...
}
{% endif %}
```

### 2. Use Early Returns in Complex Logic

Structure templates to avoid deeply nested conditions:

```jinja
{# Efficient: Early return pattern #}
{% if not include_feature_x %}
// Feature X is disabled
{% else %}
// Feature X implementation
{% set feature_config = features.x %}
{% set is_advanced = feature_config.mode == "advanced" %}

{% if is_advanced %}
// Advanced feature X configuration
use feature_x::advanced::*;

pub struct AdvancedFeatureX {
    {% for option in feature_config.advanced_options %}
    pub {{ option.name }}: {{ option.type }},
    {% endfor %}
}
{% else %}
// Basic feature X configuration
use feature_x::basic::*;

pub struct BasicFeatureX {
    pub enabled: bool,
}
{% endif %}
{% endif %}

{# Less efficient: Deeply nested conditions #}
{% if include_feature_x %}
  {% if features.x.mode == "advanced" %}
    {% for option in features.x.advanced_options %}
      // Nested processing
    {% endfor %}
  {% else %}
    // Basic mode
  {% endif %}
{% endif %}
```

### 3. Optimize Loop Conditions

Move invariant conditions outside of loops:

```jinja
{# Efficient: Check condition once outside loop #}
{% set include_validation = validation_enabled | default(true) %}
{% set include_serialization = serialization_enabled | default(true) %}

{% for model in models %}
#[derive(Debug{% if include_serialization %}, Serialize, Deserialize{% endif %})]
pub struct {{ model.name | pascal_case }} {
    {% for field in model.fields %}
    pub {{ field.name }}: {{ field.type }},
    {% endfor %}
}

{% if include_validation %}
impl {{ model.name | pascal_case }} {
    pub fn validate(&self) -> Result<(), ValidationError> {
        // Validation logic
        Ok(())
    }
}
{% endif %}
{% endfor %}

{# Less efficient: Check conditions inside each loop iteration #}
{% for model in models %}
#[derive(Debug{% if validation_enabled | default(true) %}, Serialize, Deserialize{% endif %})]
pub struct {{ model.name | pascal_case }} {
    {% for field in model.fields %}
    pub {{ field.name }}: {{ field.type }},
    {% endfor %}
}

{% if validation_enabled | default(true) %}
impl {{ model.name | pascal_case }} {
    pub fn validate(&self) -> Result<(), ValidationError> {
        Ok(())
    }
}
{% endif %}
{% endfor %}
```

## Memory-Efficient Templates

### 1. Minimize Large Data Processing

Process large datasets efficiently:

```jinja
{# Efficient: Process in chunks or use generators #}
{% set endpoint_groups = api_endpoints | groupby("category") %}
{% for category, endpoints in endpoint_groups %}
// {{ category | title }} endpoints
pub mod {{ category | snake_case }} {
    {% for endpoint in endpoints %}
    pub async fn {{ endpoint.name | snake_case }}() {
        // Implementation
    }
    {% endfor %}
}
{% endfor %}

{# Less efficient: Process all data at once #}
{% for endpoint in api_endpoints %}
  {% if endpoint.category == "auth" %}
    // Auth endpoint
  {% elif endpoint.category == "users" %}
    // Users endpoint
  {% endif %}
{% endfor %}
```

### 2. Efficient String Building

Use efficient string concatenation patterns:

```jinja
{# Efficient: Build strings in single operations #}
{% set import_list = [] %}
{% for dependency in dependencies %}
  {% set import_list = import_list + ["use " + dependency.name + "::" + dependency.module + ";"] %}
{% endfor %}

{{ import_list | join("\n") }}

{# Less efficient: Multiple string operations #}
{% for dependency in dependencies %}
use {{ dependency.name }}::{{ dependency.module }};
{% endfor %}
```

### 3. Avoid Redundant Processing

Cache results of expensive operations:

```jinja
{# Efficient: Cache expensive filter operations #}
{% set sorted_models = models | sort(attribute='name') %}
{% set public_models = sorted_models | selectattr('visibility', 'equalto', 'public') %}
{% set private_models = sorted_models | rejectattr('visibility', 'equalto', 'public') %}

// Public models
{% for model in public_models %}
pub struct {{ model.name | pascal_case }} { /* ... */ }
{% endfor %}

// Private models
{% for model in private_models %}
struct {{ model.name | pascal_case }} { /* ... */ }
{% endfor %}

{# Less efficient: Repeat sorting and filtering #}
{% for model in models | sort(attribute='name') | selectattr('visibility', 'equalto', 'public') %}
pub struct {{ model.name | pascal_case }} { /* ... */ }
{% endfor %}

{% for model in models | sort(attribute='name') | rejectattr('visibility', 'equalto', 'public') %}
struct {{ model.name | pascal_case }} { /* ... */ }
{% endfor %}
```

## Template Size Optimization

### 1. Modular Template Design

Break large templates into smaller, focused modules:

```jinja
{# main.rs - Main template file #}
{% include "includes/license_header" %}
{% include "includes/imports" %}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    {% include "includes/initialization" %}
    {% include "includes/main_logic" %}
    Ok(())
}

{% include "includes/helper_functions" %}
```

### 2. Conditional Template Inclusion

Only include templates when needed:

```jinja
{# src/lib.rs #}
{% include "includes/base_exports" %}

{% if include_database %}
{% include "database/exports" %}
{% endif %}

{% if include_auth %}
{% include "auth/exports" %}
{% endif %}

{% if include_api %}
{% include "api/exports" %}
{% endif %}
```

### 3. Template Inheritance for Reuse

Use template inheritance to reduce duplication:

```jinja
{# base_service.rs #}
{% include "includes/license_header" %}

//! {{ service_name | title }} service implementation

use std::sync::Arc;
use async_trait::async_trait;

{% block imports %}{% endblock %}

#[async_trait]
pub trait {{ service_name | pascal_case }}Service {
    {% block trait_methods %}{% endblock %}
}

pub struct {{ service_name | pascal_case }}ServiceImpl {
    {% block service_fields %}{% endblock %}
}

#[async_trait]
impl {{ service_name | pascal_case }}Service for {{ service_name | pascal_case }}ServiceImpl {
    {% block trait_implementation %}{% endblock %}
}

{% block additional_implementations %}{% endblock %}
```

## Performance Monitoring

### 1. Template Rendering Metrics

Add timing instrumentation to critical templates:

```jinja
{# For development: Add timing comments #}
{% if debug_performance %}
{# Started processing {{ models | length }} models at {{ "now" | format_time }} #}
{% endif %}

{% for model in models %}
  {# Process model {{ loop.index }}/{{ models | length }} #}
  // Model implementation
{% endfor %}

{% if debug_performance %}
{# Completed model processing at {{ "now" | format_time }} #}
{% endif %}
```

### 2. Template Size Analysis

Monitor template size and complexity:

```python
#!/usr/bin/env python3
# analyze_template_complexity.py

import os
from pathlib import Path

def analyze_template(file_path):
    """Analyze template complexity metrics."""
    with open(file_path, 'r') as f:
        content = f.read()
    
    lines = content.split('\n')
    
    metrics = {
        'file': file_path,
        'total_lines': len(lines),
        'template_lines': len([l for l in lines if '{%' in l or '{{' in l]),
        'loop_count': content.count('{% for'),
        'condition_count': content.count('{% if'),
        'include_count': content.count('{% include'),
        'macro_count': content.count('{% macro'),
        'file_size': os.path.getsize(file_path),
    }
    
    # Calculate complexity score
    complexity = (
        metrics['loop_count'] * 3 +
        metrics['condition_count'] * 2 +
        metrics['include_count'] * 1 +
        metrics['macro_count'] * 2
    )
    metrics['complexity_score'] = complexity
    
    return metrics

def main():
    template_dir = Path('content')
    all_metrics = []
    
    for template_file in template_dir.rglob('*'):
        if template_file.is_file():
            metrics = analyze_template(template_file)
            all_metrics.append(metrics)
    
    # Sort by complexity
    all_metrics.sort(key=lambda m: m['complexity_score'], reverse=True)
    
    print("Template Complexity Analysis")
    print("=" * 50)
    
    for metrics in all_metrics[:10]:  # Top 10 most complex
        print(f"{metrics['file']}")
        print(f"  Lines: {metrics['total_lines']}, Template: {metrics['template_lines']}")
        print(f"  Loops: {metrics['loop_count']}, Conditions: {metrics['condition_count']}")
        print(f"  Complexity Score: {metrics['complexity_score']}")
        print()

if __name__ == "__main__":
    main()
```

### 3. Performance Testing

Create automated performance tests:

```bash
#!/bin/bash
# benchmark_templates.sh

echo "Template Performance Benchmark"
echo "=============================="

configs=(
    "small:project_name=small-test"
    "medium:project_name=medium-test,include_auth=true,include_database=true"
    "large:project_name=large-test,include_auth=true,include_database=true,include_api=true,features=auth,database,api,logging,metrics"
)

for config in "${configs[@]}"; do
    IFS=':' read -r size params <<< "$config"
    echo "Testing $size configuration..."
    
    # Run benchmark
    time_output=$(time ( \
        archetect render . "benchmark-$size" --headless --overwrite \
        $(echo "$params" | tr ',' '\n' | sed 's/^/-a /') \
    ) 2>&1)
    
    # Extract timing
    real_time=$(echo "$time_output" | grep real | awk '{print $2}')
    echo "  Time: $real_time"
    
    # Clean up
    rm -rf "benchmark-$size"
done
```

By following these performance optimization strategies, you can ensure your templates render quickly and efficiently, even for complex archetypes with many features and large amounts of generated content.