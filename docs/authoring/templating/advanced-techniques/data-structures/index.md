---
sidebar_position: 3
---

# Complex Data Structures

Working with complex nested data structures in templates enables sophisticated code generation scenarios. This section covers techniques for handling arrays, objects, relationships, and hierarchical data effectively.

## Nested Object Navigation

### Accessing Nested Properties

Handle deeply nested configuration objects:

```jinja
{# src/config/database.rs #}
{% include "includes/license_header" %}

//! Database configuration for {{ project_name }}

use serde::{Deserialize, Serialize};
use std::time::Duration;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseConfig {
    {% if database.connection.host is defined %}
    pub host: String,
    pub port: u16,
    {% endif %}
    {% if database.connection.credentials is defined %}
    pub username: String,
    pub password: String,
    {% endif %}
    {% if database.pool is defined %}
    pub pool: PoolConfig,
    {% endif %}
    {% if database.ssl is defined %}
    pub ssl: SslConfig,
    {% endif %}
}

{% if database.pool is defined %}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PoolConfig {
    pub min_connections: u32,
    pub max_connections: u32,
    pub acquire_timeout: Duration,
    {% if database.pool.health_check is defined %}
    pub health_check_interval: Duration,
    {% endif %}
}
{% endif %}

{% if database.ssl is defined %}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SslConfig {
    pub enabled: bool,
    {% if database.ssl.certificate is defined %}
    pub cert_file: String,
    pub key_file: String,
    {% endif %}
    {% if database.ssl.ca_cert is defined %}
    pub ca_cert_file: String,
    {% endif %}
}
{% endif %}

impl DatabaseConfig {
    pub fn new() -> Self {
        Self {
            {% if database.connection.host is defined %}
            host: "{{ database.connection.host | default('localhost') }}".to_string(),
            port: {{ database.connection.port | default(5432) }},
            {% endif %}
            {% if database.connection.credentials is defined %}
            username: "{{ database.connection.credentials.username }}".to_string(),
            password: "{{ database.connection.credentials.password }}".to_string(),
            {% endif %}
            {% if database.pool is defined %}
            pool: PoolConfig {
                min_connections: {{ database.pool.min_connections | default(1) }},
                max_connections: {{ database.pool.max_connections | default(10) }},
                acquire_timeout: Duration::from_secs({{ database.pool.acquire_timeout | default(30) }}),
                {% if database.pool.health_check is defined %}
                health_check_interval: Duration::from_secs({{ database.pool.health_check.interval | default(60) }}),
                {% endif %}
            },
            {% endif %}
            {% if database.ssl is defined %}
            ssl: SslConfig {
                enabled: {{ database.ssl.enabled | default(false) | lower }},
                {% if database.ssl.certificate is defined %}
                cert_file: "{{ database.ssl.certificate.file }}".to_string(),
                key_file: "{{ database.ssl.certificate.key_file }}".to_string(),
                {% endif %}
                {% if database.ssl.ca_cert is defined %}
                ca_cert_file: "{{ database.ssl.ca_cert }}".to_string(),
                {% endif %}
            },
            {% endif %}
        }
    }
}
```

### Safe Navigation with Defaults

Handle potentially missing nested properties:

```jinja
{# src/api/client.rs #}
{% include "includes/license_header" %}

use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::time::Duration;

#[derive(Debug, Clone)]
pub struct ApiClient {
    client: Client,
    base_url: String,
    timeout: Duration,
}

impl ApiClient {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let timeout = Duration::from_secs(
            {{ api.client.timeout.seconds | default(30) }}
        );
        
        let mut client_builder = Client::builder()
            .timeout(timeout)
            .user_agent("{{ project_name }}/{{ version | default('1.0.0') }}");
        
        {% if api.client.proxy is defined %}
        {% if api.client.proxy.http is defined %}
        client_builder = client_builder.proxy(
            reqwest::Proxy::http("{{ api.client.proxy.http }}")?
        );
        {% endif %}
        {% if api.client.proxy.https is defined %}
        client_builder = client_builder.proxy(
            reqwest::Proxy::https("{{ api.client.proxy.https }}")?
        );
        {% endif %}
        {% endif %}
        
        {% if api.client.tls is defined %}
        {% if api.client.tls.accept_invalid_certs | default(false) %}
        client_builder = client_builder.danger_accept_invalid_certs(true);
        {% endif %}
        {% if api.client.tls.cert_file is defined %}
        let cert = std::fs::read("{{ api.client.tls.cert_file }}")?;
        let cert = reqwest::Certificate::from_pem(&cert)?;
        client_builder = client_builder.add_root_certificate(cert);
        {% endif %}
        {% endif %}
        
        Ok(Self {
            client: client_builder.build()?,
            base_url: "{{ api.client.base_url | default('http://localhost:8080') }}".to_string(),
            timeout,
        })
    }
}
```

## Array and Collection Processing

### Iterating Over Complex Arrays

Process arrays of objects with nested properties:

```jinja
{# src/models/mod.rs #}
{% include "includes/license_header" %}

//! Data models for {{ project_name }}

{% for model in data_models %}
{% set model_name = model.name | pascal_case %}
{% set table_name = model.table_name | default(model.name | snake_case) %}

use serde::{Deserialize, Serialize};
{% if model.includes_timestamps | default(true) %}
use chrono::{DateTime, Utc};
{% endif %}
{% if model.includes_uuid | default(false) %}
use uuid::Uuid;
{% endif %}

#[derive(Debug, Clone, Serialize, Deserialize)]
{% if model.database.table is defined %}
#[serde(rename = "{{ table_name }}")]
{% endif %}
pub struct {{ model_name }} {
    {% for field in model.fields %}
    {% set field_name = field.name | snake_case %}
    {% set field_type = field.type %}
    
    {% if field.is_primary_key | default(false) %}
    #[serde(rename = "{{ field.db_column | default(field_name) }}")]
    {% endif %}
    {% if field.is_optional | default(false) %}
    pub {{ field_name }}: Option<{{ field_type }}>,
    {% else %}
    pub {{ field_name }}: {{ field_type }},
    {% endif %}
    {% endfor %}
    
    {% if model.includes_timestamps | default(true) %}
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    {% endif %}
}

{% if model.relationships is defined %}
// Relationships for {{ model_name }}
{% for relationship in model.relationships %}
{% set related_model = relationship.target | pascal_case %}
{% if relationship.type == "has_many" %}
impl {{ model_name }} {
    pub async fn {{ relationship.name | snake_case }}(&self, db: &Database) -> Result<Vec<{{ related_model }}>, DatabaseError> {
        // Load {{ relationship.name }} relationship
        {% if relationship.foreign_key is defined %}
        let query = "SELECT * FROM {{ relationship.target | snake_case }} WHERE {{ relationship.foreign_key }} = $1";
        {% else %}
        let query = "SELECT * FROM {{ relationship.target | snake_case }} WHERE {{ model.name | snake_case }}_id = $1";
        {% endif %}
        
        let records = sqlx::query_as::<_, {{ related_model }}>(query)
            .bind(&self.{{ model.primary_key | default('id') }})
            .fetch_all(db)
            .await?;
            
        Ok(records)
    }
}
{% elif relationship.type == "belongs_to" %}
impl {{ model_name }} {
    pub async fn {{ relationship.name | snake_case }}(&self, db: &Database) -> Result<Option<{{ related_model }}>, DatabaseError> {
        // Load {{ relationship.name }} relationship
        let query = "SELECT * FROM {{ relationship.target | snake_case }} WHERE id = $1";
        
        let record = sqlx::query_as::<_, {{ related_model }}>(query)
            .bind(&self.{{ relationship.foreign_key | default(relationship.name + '_id') }})
            .fetch_optional(db)
            .await?;
            
        Ok(record)
    }
}
{% endif %}
{% endfor %}
{% endif %}

{% if model.validations is defined %}
// Validations for {{ model_name }}
impl {{ model_name }} {
    pub fn validate(&self) -> Result<(), ValidationError> {
        {% for validation in model.validations %}
        {% if validation.type == "presence" %}
        {% for field in validation.fields %}
        if self.{{ field | snake_case }}.is_empty() {
            return Err(ValidationError::new("{{ field }}_required"));
        }
        {% endfor %}
        {% elif validation.type == "length" %}
        {% for field in validation.fields %}
        {% if validation.min is defined %}
        if self.{{ field | snake_case }}.len() < {{ validation.min }} {
            return Err(ValidationError::new("{{ field }}_too_short"));
        }
        {% endif %}
        {% if validation.max is defined %}
        if self.{{ field | snake_case }}.len() > {{ validation.max }} {
            return Err(ValidationError::new("{{ field }}_too_long"));
        }
        {% endif %}
        {% endfor %}
        {% elif validation.type == "format" %}
        {% for field in validation.fields %}
        let regex = regex::Regex::new(r"{{ validation.pattern }}")
            .map_err(|_| ValidationError::new("invalid_regex"))?;
        if !regex.is_match(&self.{{ field | snake_case }}) {
            return Err(ValidationError::new("{{ field }}_invalid_format"));
        }
        {% endfor %}
        {% endif %}
        {% endfor %}
        
        Ok(())
    }
}
{% endif %}

{% endfor %}
```

### Array Filtering and Grouping

Use filters to process collections efficiently:

```jinja
{# src/api/routes.rs #}
{% include "includes/license_header" %}

use axum::{Router, routing::{get, post, put, delete}};
use crate::handlers;

{% set public_endpoints = api_endpoints | selectattr("public", "equalto", true) %}
{% set authenticated_endpoints = api_endpoints | rejectattr("public", "equalto", true) %}
{% set grouped_endpoints = api_endpoints | groupby("module") %}

pub fn create_router() -> Router {
    let mut router = Router::new();
    
    // Public endpoints (no authentication required)
    {% for endpoint in public_endpoints %}
    router = router.route(
        "{{ endpoint.path }}", 
        {{ endpoint.method | lower }}(handlers::{{ endpoint.handler | snake_case }})
    );
    {% endfor %}
    
    // Authenticated endpoints
    {% if authenticated_endpoints %}
    let auth_router = Router::new()
        {% for endpoint in authenticated_endpoints %}
        .route(
            "{{ endpoint.path }}", 
            {{ endpoint.method | lower }}(handlers::{{ endpoint.handler | snake_case }})
        )
        {% endfor %}
        .layer(AuthLayer::new());
    
    router = router.merge(auth_router);
    {% endif %}
    
    router
}

// Handler modules organized by functionality
{% for module, endpoints in grouped_endpoints %}
pub mod {{ module | snake_case }} {
    use super::*;
    
    {% for endpoint in endpoints %}
    {% if endpoint.description is defined %}
    /// {{ endpoint.description }}
    {% endif %}
    pub async fn {{ endpoint.handler | snake_case }}(
        {% if not endpoint.public %}auth: AuthUser,{% endif %}
        {% if endpoint.path_params is defined %}
        Path(params): Path<{{ endpoint.path_params.type }}>,
        {% endif %}
        {% if endpoint.query_params is defined %}
        Query(query): Query<{{ endpoint.query_params.type }}>,
        {% endif %}
        {% if endpoint.body is defined %}
        Json(body): Json<{{ endpoint.body.type }}>,
        {% endif %}
    ) -> Result<Json<{{ endpoint.response.type }}>, StatusCode> {
        // Implementation for {{ endpoint.handler }}
        {% if endpoint.implementation is defined %}
        {{ endpoint.implementation }}
        {% else %}
        todo!("Implement {{ endpoint.handler }}")
        {% endif %}
    }
    {% endfor %}
}
{% endfor %}
```

## Hierarchical Data Processing

### Tree Structure Generation

Handle hierarchical data like menu systems or organization charts:

```jinja
{# src/navigation/mod.rs #}
{% include "includes/license_header" %}

//! Navigation system for {{ project_name }}

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MenuItem {
    pub id: String,
    pub title: String,
    pub url: Option<String>,
    pub icon: Option<String>,
    pub children: Vec<MenuItem>,
    pub permissions: Vec<String>,
}

{% macro render_menu_item(item, level=0) %}
{% set indent = "    " * level %}
{{ indent }}MenuItem {
{{ indent }}    id: "{{ item.id }}".to_string(),
{{ indent }}    title: "{{ item.title }}".to_string(),
{{ indent }}    url: {% if item.url %}Some("{{ item.url }}".to_string()){% else %}None{% endif %},
{{ indent }}    icon: {% if item.icon %}Some("{{ item.icon }}".to_string()){% else %}None{% endif %},
{{ indent }}    permissions: vec![
{% for permission in item.permissions | default([]) %}
{{ indent }}        "{{ permission }}".to_string(),
{% endfor %}
{{ indent }}    ],
{{ indent }}    children: vec![
{% for child in item.children | default([]) %}
{{ render_menu_item(child, level + 2) }},
{% endfor %}
{{ indent }}    ],
{{ indent }}}
{% endmacro %}

pub fn create_navigation() -> Vec<MenuItem> {
    vec![
{% for item in navigation.menu_items %}
        {{ render_menu_item(item, 2) }},
{% endfor %}
    ]
}

// Helper functions for navigation
impl MenuItem {
    pub fn find_by_id(&self, id: &str) -> Option<&MenuItem> {
        if self.id == id {
            return Some(self);
        }
        
        for child in &self.children {
            if let Some(found) = child.find_by_id(id) {
                return Some(found);
            }
        }
        
        None
    }
    
    pub fn is_accessible_by(&self, user_permissions: &[String]) -> bool {
        if self.permissions.is_empty() {
            return true;
        }
        
        self.permissions.iter().any(|perm| user_permissions.contains(perm))
    }
    
    pub fn filter_by_permissions(&self, user_permissions: &[String]) -> Option<MenuItem> {
        if !self.is_accessible_by(user_permissions) {
            return None;
        }
        
        let filtered_children: Vec<MenuItem> = self.children
            .iter()
            .filter_map(|child| child.filter_by_permissions(user_permissions))
            .collect();
        
        Some(MenuItem {
            id: self.id.clone(),
            title: self.title.clone(),
            url: self.url.clone(),
            icon: self.icon.clone(),
            permissions: self.permissions.clone(),
            children: filtered_children,
        })
    }
}
```

### Recursive Data Processing

Handle self-referential structures:

```jinja
{# src/organization/mod.rs #}
{% include "includes/license_header" %}

//! Organization structure for {{ project_name }}

use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Department {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub parent_id: Option<Uuid>,
    pub manager_id: Option<Uuid>,
    pub employees: Vec<Employee>,
    pub subdepartments: Vec<Department>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Employee {
    pub id: Uuid,
    pub name: String,
    pub title: String,
    pub department_id: Uuid,
    pub manager_id: Option<Uuid>,
    pub reports: Vec<Employee>,
}

{% macro generate_department_tree(departments, parent_id=None, level=0) %}
{% set filtered_depts = departments | selectattr("parent_id", "equalto", parent_id) %}
{% for dept in filtered_depts %}
{% set indent = "    " * level %}
{{ indent }}Department {
{{ indent }}    id: Uuid::parse_str("{{ dept.id }}")?,
{{ indent }}    name: "{{ dept.name }}".to_string(),
{{ indent }}    description: {% if dept.description %}Some("{{ dept.description }}".to_string()){% else %}None{% endif %},
{{ indent }}    parent_id: {% if dept.parent_id %}Some(Uuid::parse_str("{{ dept.parent_id }}")?){% else %}None{% endif %},
{{ indent }}    manager_id: {% if dept.manager_id %}Some(Uuid::parse_str("{{ dept.manager_id }}")?){% else %}None{% endif %},
{{ indent }}    employees: vec![
{% for employee in dept.employees | default([]) %}
{{ indent }}        Employee {
{{ indent }}            id: Uuid::parse_str("{{ employee.id }}")?,
{{ indent }}            name: "{{ employee.name }}".to_string(),
{{ indent }}            title: "{{ employee.title }}".to_string(),
{{ indent }}            department_id: Uuid::parse_str("{{ dept.id }}")?,
{{ indent }}            manager_id: {% if employee.manager_id %}Some(Uuid::parse_str("{{ employee.manager_id }}")?){% else %}None{% endif %},
{{ indent }}            reports: vec![], // Populated separately
{{ indent }}        },
{% endfor %}
{{ indent }}    ],
{{ indent }}    subdepartments: vec![
{{ generate_department_tree(departments, dept.id, level + 2) }}
{{ indent }}    ],
{{ indent }}},
{% endfor %}
{% endmacro %}

impl Department {
    pub fn create_organization() -> Result<Vec<Department>, Box<dyn std::error::Error>> {
        Ok(vec![
{{ generate_department_tree(organization.departments, None, 3) }}
        ])
    }
}
```

## Dynamic Data Transformation

### Runtime Data Processing

Process and transform data during template rendering:

```jinja
{# src/database/schema.rs #}
{% include "includes/license_header" %}

//! Database schema definitions

{% set tables_by_module = tables | groupby("module") %}
{% set foreign_keys = [] %}

{% for table in tables %}
  {% for field in table.fields %}
    {% if field.foreign_key is defined %}
      {% set foreign_keys = foreign_keys + [{"from": table.name, "to": field.foreign_key.table, "field": field.name}] %}
    {% endif %}
  {% endfor %}
{% endfor %}

use sqlx::migrate::MigrateDatabase;

{% for module, module_tables in tables_by_module %}
pub mod {{ module | snake_case }} {
    use sqlx::{Row, FromRow};
    use serde::{Deserialize, Serialize};
    
    {% for table in module_tables %}
    {% set table_name = table.name | snake_case %}
    
    #[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
    pub struct {{ table.name | pascal_case }} {
        {% for field in table.fields %}
        {% if field.is_primary_key | default(false) %}
        #[sqlx(rename = "{{ field.db_name | default(field.name | snake_case) }}")]
        {% endif %}
        pub {{ field.name | snake_case }}: {% if field.nullable | default(false) %}Option<{% endif %}{{ field.rust_type }}{% if field.nullable | default(false) %}>{% endif %},
        {% endfor %}
    }
    
    impl {{ table.name | pascal_case }} {
        pub const TABLE_NAME: &'static str = "{{ table_name }}";
        
        {% if table.generate_crud | default(true) %}
        pub async fn create(db: &sqlx::PgPool, data: &Self) -> Result<Self, sqlx::Error> {
            let query = r#"
                INSERT INTO {{ table_name }} (
                    {% for field in table.fields %}
                    {% if not field.is_primary_key | default(false) %}
                    {{ field.db_name | default(field.name | snake_case) }}{% if not loop.last %},{% endif %}
                    {% endif %}
                    {% endfor %}
                ) VALUES (
                    {% for field in table.fields %}
                    {% if not field.is_primary_key | default(false) %}
                    ${{ loop.index }}{% if not loop.last %},{% endif %}
                    {% endif %}
                    {% endfor %}
                ) RETURNING *
            "#;
            
            sqlx::query_as::<_, Self>(query)
                {% for field in table.fields %}
                {% if not field.is_primary_key | default(false) %}
                .bind(&data.{{ field.name | snake_case }})
                {% endif %}
                {% endfor %}
                .fetch_one(db)
                .await
        }
        {% endif %}
    }
    {% endfor %}
}
{% endfor %}

// Generate migration SQL
pub const MIGRATION_SQL: &str = r#"
{% for table in tables %}
CREATE TABLE {{ table.name | snake_case }} (
    {% for field in table.fields %}
    {{ field.db_name | default(field.name | snake_case) }} {{ field.sql_type }}{% if field.is_primary_key | default(false) %} PRIMARY KEY{% endif %}{% if not field.nullable | default(false) and not field.is_primary_key | default(false) %} NOT NULL{% endif %}{% if field.default is defined %} DEFAULT {{ field.default }}{% endif %}{% if not loop.last %},{% endif %}
    {% endfor %}
);

{% endfor %}

-- Foreign key constraints
{% for fk in foreign_keys %}
ALTER TABLE {{ fk.from | snake_case }} 
ADD CONSTRAINT fk_{{ fk.from | snake_case }}_{{ fk.field | snake_case }}
FOREIGN KEY ({{ fk.field | snake_case }}) REFERENCES {{ fk.to | snake_case }}(id);

{% endfor %}
"#;
```

These techniques for handling complex data structures enable you to create sophisticated templates that can process and transform complex configuration data into well-structured, maintainable code.