---
sidebar_position: 3
---

# String

String rendering processes template content directly in memory, applying context variables to generate dynamic text content. This is ideal for creating configuration files, code snippets, or any dynamic text content without filesystem operations.

## Basic String Rendering

### The render() Function

The `render()` function processes template strings using Jinja2-compatible syntax:

```rhai
// Basic string rendering
let template = "Hello {{ name }}!";
let context = #{
    name: "World"
};
let result = render(template, context);
// Result: "Hello World!"
```

### Template Syntax

String templates use the same Jinja2 syntax as file templates:

```rhai
// Variable substitution
let greeting = render("Welcome to {{ project_name }}", #{
    project_name: "MyApp"
});

// With filters
let class_name = render("{{ service_name | pascal_case }}", #{
    service_name: "user service"
});
// Result: "UserService"

// Conditional content
let config = render(
    "debug={{ debug_mode | lower }}{% if environment %}\nenvironment={{ environment }}{% endif %}",
    #{
        debug_mode: true,
        environment: "development"
    }
);
// Result: "debug=true\nenvironment=development"
```

## String Rendering with Context

### Variable Substitution

```rhai
// Simple variables
let template = "Project: {{ project_name }}, Version: {{ version }}";
let context = #{
    project_name: "my-app",
    version: "1.0.0"
};

let output = render(template, context);
// Result: "Project: my-app, Version: 1.0.0"
```

### Complex Data Structures

```rhai
// Nested objects
let template = `
Database Configuration:
  Host: {{ database.host }}
  Port: {{ database.port }}
  User: {{ database.credentials.username }}
`;

let context = #{
    database: #{
        host: "localhost",
        port: 5432,
        credentials: #{
            username: "admin",
            password: "secret"
        }
    }
};

let db_config = render(template, context);
```

### Arrays and Lists

```rhai
// Iterating over arrays
let template = `
Dependencies:
{% for dep in dependencies %}
  - {{ dep.name }}: {{ dep.version }}
{% endfor %}
`;

let context = #{
    dependencies: [
        #{ name: "serde", version: "1.0" },
        #{ name: "tokio", version: "1.20" },
        #{ name: "reqwest", version: "0.11" }
    ]
};

let deps_list = render(template, context);
```

## Template Syntax Reference

### Variable Access

```rhai
// Direct variable access
let template = "{{ variable_name }}";

// Object property access
let template = "{{ object.property }}";

// Array index access
let template = "{{ array[0] }}";

// Nested access
let template = "{{ user.profile.settings.theme }}";
```

### Conditional Rendering

```rhai
// If statements
let template = `
{% if debug_mode %}
LOG_LEVEL=debug
{% else %}
LOG_LEVEL=info
{% endif %}
`;

// Conditional with comparisons
let template = `
{% if port > 1000 %}
PORT={{ port }}
{% else %}
PORT=8080
{% endif %}
`;

let context = #{
    debug_mode: true,
    port: 3000
};

let config = render(template, context);
```

### Loops and Iteration

```rhai
// For loops
let template = `
{% for item in items %}
Item {{ loop.index }}: {{ item }}
{% endfor %}
`;

// Loop with conditions
let template = `
{% for service in services %}
  {% if service.enabled %}
{{ service.name }}: {{ service.port }}
  {% endif %}
{% endfor %}
`;

let context = #{
    items: ["first", "second", "third"],
    services: [
        #{ name: "web", port: 80, enabled: true },
        #{ name: "cache", port: 6379, enabled: false },
        #{ name: "db", port: 5432, enabled: true }
    ]
};

let service_list = render(template, context);
```

### Filters and Functions

```rhai
// Case transformation filters
let template = `
Class: {{ class_name | pascal_case }}
Variable: {{ class_name | snake_case }}
Constant: {{ class_name | upper_case }}
`;

// String manipulation
let template = `
Length: {{ text | length }}
Uppercase: {{ text | upper }}
Title: {{ text | title }}
`;

let context = #{
    class_name: "user-service",
    text: "hello world"
};

let formatted = render(template, context);
```

## Advanced String Rendering

### Template Composition

```rhai
// Building complex templates from parts
let header_template = "# {{ title }}\n\n";
let content_template = "{{ content }}\n";
let footer_template = "\n---\nGenerated on {{ timestamp }}";

let full_template = header_template + content_template + footer_template;

let context = #{
    title: "API Documentation",
    content: "This is the main content.",
    timestamp: "2024-01-01"
};

let document = render(full_template, context);
```

### Dynamic Template Selection

```rhai
// Choose template based on context
let templates = #{
    "rust": "fn {{ function_name }}() -> {{ return_type }} {\n    {{ body }}\n}",
    "python": "def {{ function_name }}() -> {{ return_type }}:\n    {{ body }}",
    "javascript": "function {{ function_name }}() {\n    {{ body }}\n}"
};

let context = #{
    language: "rust",
    function_name: "hello_world",
    return_type: "String",
    body: "\"Hello, World!\".to_string()"
};

let code = render(templates[context.language], context);
```

### Multi-Pass Rendering

```rhai
// First pass: generate intermediate content
let first_template = "{{ prefix }}_{{ base_name }}";
let first_context = #{
    prefix: "api",
    base_name: "service"
};

let intermediate = render(first_template, first_context);

// Second pass: use result in next template
let second_template = "struct {{ struct_name | pascal_case }} {\n    name: String,\n}";
let second_context = #{
    struct_name: intermediate
};

let final_code = render(second_template, second_context);
```

## Practical Examples

### Configuration File Generation

```rhai
// Generate YAML configuration
let yaml_template = `
application:
  name: {{ app_name }}
  version: {{ app_version }}
  environment: {{ environment }}

server:
  host: {{ server.host }}
  port: {{ server.port }}
  ssl: {{ server.ssl }}

database:
  driver: {{ database.driver }}
  host: {{ database.host }}
  port: {{ database.port }}
  name: {{ database.name }}

logging:
  level: {{ logging.level }}
  format: {{ logging.format }}
{% if logging.file %}
  file: {{ logging.file }}
{% endif %}
`;

let context = #{
    app_name: "web-api",
    app_version: "1.2.0",
    environment: "production",
    server: #{
        host: "0.0.0.0",
        port: 8080,
        ssl: true
    },
    database: #{
        driver: "postgresql",
        host: "db.example.com",
        port: 5432,
        name: "app_db"
    },
    logging: #{
        level: "info",
        format: "json",
        file: "/var/log/app.log"
    }
};

let config_yaml = render(yaml_template, context);
```

### Code Generation

```rhai
// Generate Rust struct with methods
let struct_template = `
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct {{ struct_name }} {
{% for field in fields %}
    pub {{ field.name }}: {{ field.type }},
{% endfor %}
}

impl {{ struct_name }} {
    pub fn new(
{% for field in fields %}
        {{ field.name }}: {{ field.type }},
{% endfor %}
    ) -> Self {
        Self {
{% for field in fields %}
            {{ field.name }},
{% endfor %}
        }
    }

{% for field in fields %}
    pub fn get_{{ field.name }}(&self) -> &{{ field.type }} {
        &self.{{ field.name }}
    }

    pub fn set_{{ field.name }}(&mut self, value: {{ field.type }}) {
        self.{{ field.name }} = value;
    }
{% endfor %}
}
`;

let context = #{
    struct_name: "User",
    fields: [
        #{ name: "id", type: "u64" },
        #{ name: "username", type: "String" },
        #{ name: "email", type: "String" },
        #{ name: "active", type: "bool" }
    ]
};

let rust_code = render(struct_template, context);

```

### Environment-Specific Configuration

```rhai
// Generate environment-specific configurations
let env_config_template = `
# {{ environment | upper }} Configuration

{% if environment == "development" %}
DEBUG=true
LOG_LEVEL=debug
DATABASE_URL={{ dev_db_url }}
CACHE_TTL=60
{% elif environment == "staging" %}
DEBUG=false
LOG_LEVEL=info
DATABASE_URL={{ staging_db_url }}
CACHE_TTL=300
{% elif environment == "production" %}
DEBUG=false
LOG_LEVEL=warn
DATABASE_URL={{ prod_db_url }}
CACHE_TTL=3600
{% endif %}

# Common settings
APP_NAME={{ app_name }}
PORT={{ port }}
{% if ssl_enabled %}
SSL_CERT={{ ssl_cert_path }}
SSL_KEY={{ ssl_key_path }}
{% endif %}
`;

let environments = ["development", "staging", "production"];
let configs = #{};

for env in environments {
    let context = #{
        environment: env,
        app_name: "my-web-app",
        port: if env == "development" { 3000 } else { 8080 },
        dev_db_url: "postgresql://localhost:5432/app_dev",
        staging_db_url: "postgresql://staging-db:5432/app_staging",
        prod_db_url: "postgresql://prod-db:5432/app_prod",
        ssl_enabled: env != "development",
        ssl_cert_path: "/etc/ssl/certs/app.crt",
        ssl_key_path: "/etc/ssl/private/app.key"
    };

    configs[env] = render(env_config_template, context);
}
```

## Integration with Other Features

### Using with Case Transformations

```rhai
// Generate code with proper naming conventions
let class_template = `
class {{ class_name | pascal_case }} {
    private {{ field_name | camel_case }}: {{ field_type }};
    
    public get{{ field_name | pascal_case }}(): {{ field_type }} {
        return this.{{ field_name | camel_case }};
    }
    
    public set{{ field_name | pascal_case }}(value: {{ field_type }}): void {
        this.{{ field_name | camel_case }} = value;
    }
}

export const {{ constant_name | upper_case }} = "{{ class_name | kebab_case }}";
`;

let context = #{
    class_name: "user_profile",
    field_name: "full_name",
    field_type: "string",
    constant_name: "default_class"
};

let typescript_code = render(class_template, context);
```

### Using with Switches

```rhai
// Conditional rendering based on switches
let config_template = if switch_enabled("production") {
    "ENV=production\nDEBUG=false\nLOG_LEVEL=warn"
} else {
    "ENV=development\nDEBUG=true\nLOG_LEVEL=debug"
};

let env_config = render(config_template + "\nAPP_NAME={{ app_name }}", #{
    app_name: context.project_name
});
```

## Best Practices

### Template Organization

```rhai
// Keep templates organized and reusable
let templates = #{
    rust_struct: "pub struct {{ name | pascal_case }} {\n{% for field in fields %}    pub {{ field.name | snake_case }}: {{ field.type }},\n{% endfor %}}",
    
    rust_impl: "impl {{ name | pascal_case }} {\n    pub fn new({{ params }}) -> Self {\n        Self {\n{% for field in fields %}            {{ field.name | snake_case }},\n{% endfor %}        }\n    }\n}",
    
    rust_test: "#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn test_{{ name | snake_case }}_creation() {\n        // TODO: Implement test\n    }\n}"
};

// Use templates consistently
let struct_code = render(templates.rust_struct, struct_context);
let impl_code = render(templates.rust_impl, impl_context);
let test_code = render(templates.rust_test, test_context);
```

### Error Handling

```rhai
// Validate context before rendering
let required_fields = ["project_name", "author", "version"];

for field in required_fields {
    if !(field in context) {
        throw "Missing required field: " + field;
    }
}

// Safe rendering with fallbacks
let safe_template = "Project: {{ project_name | default('Unnamed Project') }}\nAuthor: {{ author | default('Unknown') }}";
let output = render(safe_template, context);
```

### Performance Considerations

```rhai
// Cache rendered templates when generating multiple similar items
let cached_templates = #{};

for service in context.services {
    let cache_key = "service_" + service.type;
    
    if !(cache_key in cached_templates) {
        cached_templates[cache_key] = render(service_template, service);
    }
    
    // Use cached result
    let service_code = cached_templates[cache_key];
}
```

String rendering provides powerful in-memory template processing capabilities, enabling dynamic content generation without filesystem operations. It's particularly effective for configuration generation, code snippets, and any scenario requiring flexible text templating with rich context support.

## Next Steps

- Learn [Archetype Rendering](../archetype/) for archetype composition
- Explore [Directory Rendering](../directories/) for file-based template processing
- Check the Template documentation for advanced Jinja2 syntax features