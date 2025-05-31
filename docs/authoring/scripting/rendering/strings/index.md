---
sidebar_position: 1
---

# Rendering Strings

String rendering allows you to process template strings inline within your Rhai scripts, enabling dynamic content generation without file I/O operations. This is perfect for creating configuration strings, code snippets, or processing user input into formatted output.

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

## Practical Examples

### Configuration Generation

```rhai
// Generate configuration files dynamically
let database_config = render(
    "[database]\nhost={{ host }}\nport={{ port }}\nname={{ db_name }}",
    #{
        host: "localhost",
        port: 5432,
        db_name: snake_case(context.project_name) + "_db"
    }
);

// API endpoint configuration
let api_config = render(
    "API_BASE_URL={{ protocol }}://{{ host }}:{{ port }}/{{ version }}",
    #{
        protocol: switch_enabled("https") ? "https" : "http",
        host: context.api_host,
        port: context.api_port,
        version: "v1"
    }
);
```

### Code Generation

```rhai
// Generate Rust struct definitions
let struct_template = "pub struct {{ struct_name | pascal_case }} {\n{% for field in fields %}    pub {{ field.name | snake_case }}: {{ field.type }},\n{% endfor %}}";

let struct_code = render(struct_template, #{
    struct_name: "user account",
    fields: [
        #{ name: "user name", type: "String" },
        #{ name: "email address", type: "String" },
        #{ name: "created at", type: "DateTime<Utc>" }
    ]
});

// Generate function signatures
let function_template = "pub fn {{ func_name | snake_case }}({{ params | join(', ') }}) -> {{ return_type }} {{\n    todo!()\n}}";

let function_code = render(function_template, #{
    func_name: "create user",
    params: ["name: String", "email: String"],
    return_type: "Result<User, Error>"
});
```

### Documentation Generation

```rhai
// Generate README sections
let readme_template = "# {{ project_name | title_case }}\n\n{{ description }}\n\n## Installation\n\n```bash\n{{ install_command }}\n```\n\n## Usage\n\n{{ usage_example }}";

let readme_content = render(readme_template, #{
    project_name: context.project_name,
    description: context.description,
    install_command: "cargo install " + kebab_case(context.project_name),
    usage_example: kebab_case(context.project_name) + " --help"
});

// Generate API documentation
let api_doc_template = "### {{ method | upper }} {{ endpoint }}\n\n{{ description }}\n\n{% if parameters %}**Parameters:**\n{% for param in parameters %}- `{{ param.name }}` ({{ param.type }}): {{ param.description }}\n{% endfor %}{% endif %}";

let api_doc = render(api_doc_template, #{
    method: "post",
    endpoint: "/api/users",
    description: "Create a new user account",
    parameters: [
        #{ name: "name", type: "string", description: "User's full name" },
        #{ name: "email", type: "string", description: "User's email address" }
    ]
});
```

## Advanced String Rendering

### Multi-line Templates with Heredocs

```rhai
// Using heredoc for complex templates
let dockerfile_template = `FROM rust:1.70 as builder

WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src

RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/target/release/{{ binary_name }} ./{{ binary_name }}

{% if enable_health_check %}
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ./{{ binary_name }} health || exit 1
{% endif %}

EXPOSE {{ port }}
CMD ["./{{ binary_name }}"]`;

let dockerfile = render(dockerfile_template, #{
    binary_name: kebab_case(context.project_name),
    enable_health_check: switch_enabled("monitoring"),
    port: context.port
});
```

### Dynamic Template Construction

```rhai
// Build templates dynamically
let base_template = "package {{ package_name }}\n\n";

if switch_enabled("tests") {
    base_template += "import \"testing\"\n";
}

if switch_enabled("http") {
    base_template += "import \"net/http\"\n";
}

base_template += "\nfunc main() {\n    // TODO: Implementation\n}";

let go_code = render(base_template, #{
    package_name: snake_case(context.project_name)
});
```

### Conditional Template Sections

```rhai
// Template with complex conditionals
let makefile_template = `.PHONY: build test clean{% if enable_docker %} docker{% endif %}

build:
	cargo build{% if optimize %} --release{% endif %}

test:
	cargo test{% if verbose %} -- --nocapture{% endif %}

clean:
	cargo clean

{% if enable_docker %}
docker:
	docker build -t {{ image_name }} .

docker-run:
	docker run -p {{ port }}:{{ port }} {{ image_name }}
{% endif %}

{% if enable_docs %}
docs:
	cargo doc --open
{% endif %}`;

let makefile = render(makefile_template, #{
    enable_docker: switch_enabled("docker"),
    enable_docs: switch_enabled("docs"),
    optimize: switch_enabled("release"),
    verbose: switch_enabled("verbose"),
    image_name: kebab_case(context.project_name),
    port: context.port
});
```

## Integration with Other Features

### Using with Case Transformations

```rhai
// Combine rendering with case transformations
let class_template = "class {{ class_name }} {\n    constructor({{ constructor_params }}) {\n{% for field in fields %}        this.{{ field }} = {{ field }};\n{% endfor %}    }\n}";

let typescript_class = render(class_template, #{
    class_name: pascal_case(context.service_name),
    constructor_params: context.fields.map(|field| camel_case(field)).join(", "),
    fields: context.fields.map(|field| camel_case(field))
});
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

### Integration with File Writing

```rhai
// Render strings and write to files
let license_content = render(
    "Copyright (c) {{ year }} {{ author }}\n\nPermission is hereby granted...",
    #{
        year: 2024,
        author: context.author_name
    }
);

// Write rendered content to file (if file module is available)
// write_file("LICENSE", license_content);
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

String rendering provides immediate, flexible template processing that's perfect for generating configuration files, code snippets, and dynamic content within your archetype scripts.

## Next Steps

- Learn [Directory Rendering](../directories/) for file system operations
- Explore [Component Rendering](../components/) for archetype composition
- Check the Template documentation for advanced Jinja2 syntax