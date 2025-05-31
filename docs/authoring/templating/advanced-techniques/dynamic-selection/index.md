---
sidebar_position: 2
---

# Dynamic Template Selection

Dynamic template selection allows you to choose different template content, files, or behaviors based on user inputs, configuration variables, or runtime conditions. This enables highly flexible and adaptive archetypes.

## Conditional Content Selection

### Basic Conditional Rendering

Select different code patterns based on user choices:

```jinja
{# src/database/connection.rs #}
{% include "includes/license_header" %}

//! Database connection management for {{ project_name }}

{% if database_type == "postgresql" %}
use sqlx::{PgPool, postgres::PgPoolOptions};
use std::env;

pub type DatabasePool = PgPool;

pub async fn create_pool() -> Result<DatabasePool, sqlx::Error> {
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    
    PgPoolOptions::new()
        .max_connections({{ max_connections | default(5) }})
        .connect(&database_url)
        .await
}

{% elif database_type == "mysql" %}
use sqlx::{MySqlPool, mysql::MySqlPoolOptions};
use std::env;

pub type DatabasePool = MySqlPool;

pub async fn create_pool() -> Result<DatabasePool, sqlx::Error> {
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    
    MySqlPoolOptions::new()
        .max_connections({{ max_connections | default(5) }})
        .connect(&database_url)
        .await
}

{% elif database_type == "sqlite" %}
use sqlx::{SqlitePool, sqlite::SqlitePoolOptions};
use std::env;

pub type DatabasePool = SqlitePool;

pub async fn create_pool() -> Result<DatabasePool, sqlx::Error> {
    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|| "sqlite://./app.db".to_string());
    
    SqlitePoolOptions::new()
        .max_connections({{ max_connections | default(1) }})
        .connect(&database_url)
        .await
}

{% else %}
compile_error!("Unsupported database type: {{ database_type }}");
{% endif %}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_pool_creation() {
        // Database-specific test
        {% if database_type == "sqlite" %}
        std::env::set_var("DATABASE_URL", ":memory:");
        {% endif %}
        
        let pool = create_pool().await;
        assert!(pool.is_ok());
    }
}
```

### Framework Selection

Choose between different frameworks or libraries:

```jinja
{# src/web/server.rs #}
{% include "includes/license_header" %}

//! Web server implementation using {{ web_framework }}

{% if web_framework == "axum" %}
use axum::{
    extract::Path,
    http::StatusCode,
    response::{Html, Json},
    routing::{get, post},
    Router,
};
use tokio::net::TcpListener;
use tower::ServiceBuilder;
use tower_http::cors::CorsLayer;

pub async fn create_app() -> Router {
    Router::new()
        {% for route in api_routes %}
        .route("{{ route.path }}", {{ route.method | lower }}({{ route.handler }}))
        {% endfor %}
        .layer(
            ServiceBuilder::new()
                .layer(CorsLayer::permissive())
        )
}

pub async fn start_server(port: u16) -> Result<(), Box<dyn std::error::Error>> {
    let app = create_app().await;
    let listener = TcpListener::bind(format!("0.0.0.0:{}", port)).await?;
    
    println!("Server running on http://0.0.0.0:{}", port);
    axum::serve(listener, app).await?;
    Ok(())
}

{% elif web_framework == "actix-web" %}
use actix_web::{
    web, App, HttpResponse, HttpServer, Result as ActixResult,
    middleware::Logger,
};

pub async fn create_app() -> App<
    impl actix_web::dev::ServiceFactory<
        actix_web::dev::ServiceRequest,
        Response = actix_web::dev::ServiceResponse,
        Error = actix_web::Error,
        Config = (),
        InitError = (),
    >
> {
    App::new()
        .wrap(Logger::default())
        {% for route in api_routes %}
        .route("{{ route.path }}", web::{{ route.method | lower }}().to({{ route.handler }}))
        {% endfor %}
}

pub async fn start_server(port: u16) -> std::io::Result<()> {
    println!("Server running on http://0.0.0.0:{}", port);
    
    HttpServer::new(|| create_app())
        .bind(format!("0.0.0.0:{}", port))?
        .run()
        .await
}

{% elif web_framework == "warp" %}
use warp::{Filter, Reply};
use std::convert::Infallible;

pub fn create_routes() -> impl Filter<Extract = impl Reply, Error = Infallible> + Clone {
    {% for route in api_routes %}
    let {{ route.handler }}_route = warp::path("{{ route.path | trim_start_chars('/') }}")
        .and(warp::{{ route.method | lower }}())
        .and_then({{ route.handler }});
    {% endfor %}
    
    {% for route in api_routes %}
    {{ route.handler }}_route{% if not loop.last %}.or({% endif %}
    {% endfor %}
    {% for route in api_routes %}
    {% if not loop.last %}){% endif %}
    {% endfor %}
}

pub async fn start_server(port: u16) {
    let routes = create_routes();
    
    println!("Server running on http://0.0.0.0:{}", port);
    warp::serve(routes)
        .run(([0, 0, 0, 0], port))
        .await;
}

{% else %}
compile_error!("Unsupported web framework: {{ web_framework }}");
{% endif %}
```

## Feature-Based Selection

### Modular Feature Inclusion

Enable or disable entire feature sets:

```jinja
{# src/lib.rs #}
{% include "includes/license_header" %}

//! {{ project_name }} - A configurable application

pub mod config;
pub mod error;

{% if features.database %}
pub mod database;
pub mod models;
{% endif %}

{% if features.auth %}
pub mod auth;
{% if features.database %}
pub mod users;
{% endif %}
{% endif %}

{% if features.api %}
pub mod api;
{% if features.auth %}
pub mod middleware;
{% endif %}
{% endif %}

{% if features.logging %}
pub mod logging;
{% endif %}

{% if features.metrics %}
pub mod metrics;
{% endif %}

{% if features.cache %}
pub mod cache;
{% endif %}

use config::Config;
{% if features.database %}
use database::DatabasePool;
{% endif %}

pub struct Application {
    config: Config,
    {% if features.database %}
    db_pool: DatabasePool,
    {% endif %}
    {% if features.cache %}
    cache: cache::Cache,
    {% endif %}
}

impl Application {
    pub async fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let config = Config::load()?;
        
        {% if features.logging %}
        logging::init(&config.logging)?;
        {% endif %}
        
        {% if features.database %}
        let db_pool = database::create_pool(&config.database).await?;
        {% endif %}
        
        {% if features.cache %}
        let cache = cache::Cache::new(&config.cache)?;
        {% endif %}
        
        Ok(Self {
            config,
            {% if features.database %}
            db_pool,
            {% endif %}
            {% if features.cache %}
            cache,
            {% endif %}
        })
    }
    
    {% if features.api %}
    pub async fn start_api_server(&self) -> Result<(), Box<dyn std::error::Error>> {
        api::start_server(
            self.config.api.port,
            {% if features.database %}
            self.db_pool.clone(),
            {% endif %}
            {% if features.auth %}
            self.config.auth.clone(),
            {% endif %}
        ).await
    }
    {% endif %}
}
```

### Complex Feature Combinations

Handle interdependent features:

```jinja
{# src/config/mod.rs #}
{% include "includes/license_header" %}

use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub app: AppConfig,
    {% if features.database %}
    pub database: DatabaseConfig,
    {% endif %}
    {% if features.auth %}
    pub auth: AuthConfig,
    {% endif %}
    {% if features.api %}
    pub api: ApiConfig,
    {% endif %}
    {% if features.logging %}
    pub logging: LoggingConfig,
    {% endif %}
    {% if features.metrics %}
    pub metrics: MetricsConfig,
    {% endif %}
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub name: String,
    pub version: String,
    pub environment: Environment,
}

{% if features.database %}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseConfig {
    pub url: String,
    pub max_connections: u32,
    {% if features.metrics %}
    pub enable_metrics: bool,
    {% endif %}
}
{% endif %}

{% if features.auth %}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthConfig {
    pub secret_key: String,
    pub token_expiry: u64,
    {% if features.database %}
    pub user_table: String,
    {% endif %}
    {% if features.api %}
    pub jwt_header: String,
    {% endif %}
}
{% endif %}

{% if features.api %}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiConfig {
    pub host: String,
    pub port: u16,
    {% if features.auth %}
    pub require_auth: bool,
    {% endif %}
    {% if features.metrics %}
    pub enable_request_metrics: bool,
    {% endif %}
}
{% endif %}

impl Config {
    pub fn load() -> Result<Self, config::ConfigError> {
        let mut builder = config::Config::builder()
            .add_source(config::File::with_name("config/default"))
            .add_source(config::Environment::with_prefix("APP"));
        
        // Environment-specific config
        if let Ok(env) = env::var("APP_ENVIRONMENT") {
            builder = builder.add_source(config::File::with_name(&format!("config/{}", env)).required(false));
        }
        
        let config = builder.build()?;
        
        let mut app_config: Config = config.try_deserialize()?;
        
        // Validate feature combinations
        {% if features.auth and features.database %}
        if app_config.auth.user_table.is_empty() {
            return Err(config::ConfigError::Message(
                "auth.user_table is required when both auth and database features are enabled".to_string()
            ));
        }
        {% endif %}
        
        {% if features.api and features.auth %}
        if app_config.api.require_auth && app_config.auth.secret_key.is_empty() {
            return Err(config::ConfigError::Message(
                "auth.secret_key is required when API authentication is enabled".to_string()
            ));
        }
        {% endif %}
        
        Ok(app_config)
    }
}
```

## Template File Selection

### Conditional File Inclusion

Use scripting to include different files based on conditions:

```rhai
// In archetype.rhai
if web_framework == "axum" {
    include_template("templates/axum/server.rs", "src/server.rs");
    include_template("templates/axum/handlers.rs", "src/handlers.rs");
} else if web_framework == "actix-web" {
    include_template("templates/actix/server.rs", "src/server.rs");
    include_template("templates/actix/handlers.rs", "src/handlers.rs");
} else if web_framework == "warp" {
    include_template("templates/warp/server.rs", "src/server.rs");
    include_template("templates/warp/handlers.rs", "src/handlers.rs");
}

// Include database-specific files
if database_type == "postgresql" {
    include_template("templates/database/postgresql/", "src/database/");
} else if database_type == "mysql" {
    include_template("templates/database/mysql/", "src/database/");
} else if database_type == "sqlite" {
    include_template("templates/database/sqlite/", "src/database/");
}

// Conditional feature files
if include_auth {
    include_template("templates/auth/", "src/auth/");
    if database_type {
        include_template("templates/auth/database_" + database_type + ".rs", "src/auth/storage.rs");
    }
}

if include_metrics {
    include_template("templates/metrics/", "src/metrics/");
    if web_framework {
        include_template("templates/metrics/" + web_framework + "_middleware.rs", "src/metrics/middleware.rs");
    }
}
```

### Template Variant Selection

Create multiple variants of the same logical file:

```
templates/
├── config/
│   ├── simple.toml.jinja
│   ├── advanced.toml.jinja
│   └── enterprise.toml.jinja
├── main/
│   ├── cli.rs.jinja
│   ├── web.rs.jinja
│   └── service.rs.jinja
└── docker/
    ├── development.dockerfile.jinja
    ├── production.dockerfile.jinja
    └── multi-stage.dockerfile.jinja
```

Select variants based on configuration:

```rhai
// Select configuration complexity
let config_template = if complexity == "enterprise" {
    "templates/config/enterprise.toml.jinja"
} else if complexity == "advanced" {
    "templates/config/advanced.toml.jinja"
} else {
    "templates/config/simple.toml.jinja"
};

include_template(config_template, "config/app.toml");

// Select application type
let main_template = if app_type == "cli" {
    "templates/main/cli.rs.jinja"
} else if app_type == "web" {
    "templates/main/web.rs.jinja"
} else {
    "templates/main/service.rs.jinja"
};

include_template(main_template, "src/main.rs");

// Select Docker configuration
let docker_template = if environment == "production" {
    "templates/docker/production.dockerfile.jinja"
} else if environment == "staging" {
    "templates/docker/multi-stage.dockerfile.jinja"
} else {
    "templates/docker/development.dockerfile.jinja"
};

include_template(docker_template, "Dockerfile");
```

## Advanced Selection Patterns

### Nested Conditional Logic

Handle complex decision trees:

```jinja
{# src/storage/mod.rs #}
{% include "includes/license_header" %}

//! Storage implementation for {{ project_name }}

{% if storage_type == "database" %}
  {% if database_type == "postgresql" %}
    {% if include_connection_pooling %}
      use sqlx::{PgPool, postgres::PgPoolOptions};
      pub type Storage = PgPool;
    {% else %}
      use sqlx::{PgConnection, Connection};
      pub type Storage = PgConnection;
    {% endif %}
  {% elif database_type == "mysql" %}
    {% if include_connection_pooling %}
      use sqlx::{MySqlPool, mysql::MySqlPoolOptions};
      pub type Storage = MySqlPool;
    {% else %}
      use sqlx::{MySqlConnection, Connection};
      pub type Storage = MySqlConnection;
    {% endif %}
  {% endif %}
{% elif storage_type == "file" %}
  {% if file_format == "json" %}
    use serde_json;
    use std::fs;
  {% elif file_format == "yaml" %}
    use serde_yaml;
    use std::fs;
  {% elif file_format == "toml" %}
    use toml;
    use std::fs;
  {% endif %}
{% elif storage_type == "memory" %}
  use std::collections::HashMap;
  use std::sync::{Arc, RwLock};
  
  pub type Storage = Arc<RwLock<HashMap<String, String>>>;
{% endif %}

pub struct StorageManager {
    {% if storage_type == "database" %}
    pool: Storage,
    {% elif storage_type == "file" %}
    file_path: String,
    {% elif storage_type == "memory" %}
    store: Storage,
    {% endif %}
}
```

### Macro-Based Selection

Use macros for complex conditional generation:

```jinja
{# includes/conditional_macros.jinja #}
{% macro generate_handler(endpoint, framework) %}
  {% if framework == "axum" %}
pub async fn {{ endpoint.name }}(
    {% if endpoint.requires_auth %}auth: AuthUser,{% endif %}
    {% if endpoint.has_path_params %}Path(params): Path<{{ endpoint.path_params_type }}>,{% endif %}
    {% if endpoint.has_body %}Json(body): Json<{{ endpoint.body_type }}>,{% endif %}
) -> Result<Json<{{ endpoint.response_type }}>, StatusCode> {
    // Axum handler implementation
    {% include "handlers/" + framework + "/" + endpoint.name + ".rs" %}
}
  {% elif framework == "actix-web" %}
pub async fn {{ endpoint.name }}(
    {% if endpoint.requires_auth %}auth: AuthUser,{% endif %}
    {% if endpoint.has_path_params %}path: web::Path<{{ endpoint.path_params_type }}>,{% endif %}
    {% if endpoint.has_body %}body: web::Json<{{ endpoint.body_type }}>,{% endif %}
) -> ActixResult<web::Json<{{ endpoint.response_type }}>> {
    // Actix-web handler implementation
    {% include "handlers/" + framework + "/" + endpoint.name + ".rs" %}
}
  {% endif %}
{% endmacro %}

{# Use the macro #}
{% for endpoint in api_endpoints %}
{{ generate_handler(endpoint, web_framework) }}
{% endfor %}
```

This dynamic selection system provides the flexibility to create highly adaptive templates that can generate vastly different outputs based on user choices while maintaining clean, organized template code.