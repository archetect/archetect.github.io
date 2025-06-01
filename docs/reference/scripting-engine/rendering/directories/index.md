# Directory

The `Directory` type enables rendering entire directory structures from archetype contents within Archetect scripts. It provides flexible options for destination paths, rendering contexts, and file overwrite policies.

## Constructor

### Directory(path)

Creates a new Directory instance for content rendering.

**Parameters:**
- `path` (string) - Path to the source directory **relative to the archetype root**

**Returns:** Directory instance

**Example:**
```rhai
// Path is relative to the archetype root directory
let dir = Directory("contents/project");
```

:::note Archetype Root Paths
The path parameter is always relative to the root of the archetype, not the current working directory or script location.
:::

## Calling Patterns

Directory rendering supports two calling styles:

### Function-Style Calling
```rhai
render(Directory("contents/path"), context);
render(Directory("contents/path"), context, settings);
render(Directory("contents/path"), destination, context);
render(Directory("contents/path"), destination, context, settings);
```

### Method-Style Calling  
```rhai
let dir = Directory("contents/path");
dir.render(context);
dir.render(context, settings);
dir.render(destination, context);
dir.render(destination, context, settings);
```

Both patterns are functionally equivalent. Choose based on your use case:

**Function-style** is ideal for:
- One-time directory rendering
- Concise, inline operations
- Functional programming style

**Method-style** is better for:
- Reusing the same directory contents multiple times
- More readable code when using complex settings
- Object-oriented programming style

### Equivalent Examples

| Function Style | Method Style |
|----------------|--------------|
| `render(Directory("contents"), ctx)` | `Directory("contents").render(ctx)` |
| `render(Directory("src"), "output", ctx)` | `Directory("src").render("output", ctx)` |

## Method Reference

The Directory type provides render method variations with different parameter combinations:

| Call Signature | Description |
|----------------|-------------|
| `render(context)` | Basic rendering with default settings |
| `render(context, settings)` | Rendering with configuration options |
| `render(destination, context)` | Rendering to custom destination (string or Path) |
| `render(destination, context, settings)` | Rendering with destination and settings |

## Method Signatures

### render(context)

Renders the directory using default settings and destination.

**Parameters:**
- `context` (Map) - Variables for rendering

**Example:**
```rhai
let dir = Directory("contents/basic");
let context = #{
    project_name: "my-project",
    author: "John Doe"
};
dir.render(context);
```

### render(context, settings)

Renders the directory with custom settings including overwrite policy.

**Parameters:**
- `context` (Map) - Variables for rendering
- `settings` (Map) - Configuration options

**Settings Options:**
- `if_exists` - Overwrite policy (`Overwrite`, `Preserve`, `Prompt`)

**Example:**
```rhai
let dir = Directory("contents/advanced");
let context = #{
    project_name: "my-project"
};
let settings = #{
    if_exists: Overwrite
};
dir.render(context, settings);
```

### render(destination, context)

Renders the directory to a custom destination path. The destination can be either a string path or a Path object.

**Parameters:**
- `destination` (string or Path) - Target directory path
- `context` (Map) - Variables for rendering

**Examples:**

With string destination:
```rhai
let dir = Directory("contents/service");
let context = #{
    service_name: "user-service",
    port: 8080
};
dir.render("./output/services", context);
```

With Path object destination:
```rhai
let dir = Directory("contents/module");
let dest_path = Path("./src/modules");
let context = #{
    module_name: "authentication"
};
dir.render(dest_path, context);
```

### render(destination, context, settings)

Renders with destination path and custom settings. The destination can be either a string path or a Path object.

**Parameters:**
- `destination` (string or Path) - Target directory path
- `context` (Map) - Variables for rendering
- `settings` (Map) - Configuration options

**Examples:**

With Path object and settings:
```rhai
let dir = Directory("contents/component");
let dest_path = Path("./components");
let context = #{
    component_name: "UserProfile"
};
let settings = #{
    if_exists: Prompt
};
dir.render(dest_path, context, settings);
```

With string destination and settings:
```rhai
let dir = Directory("contents/api");
let context = #{
    api_version: "v1",
    database: "postgresql"
};
let settings = #{
    if_exists: Preserve
};
dir.render("./api", context, settings);
```

## Settings Configuration

### Overwrite Policies

The `if_exists` setting controls how existing files are handled:

| Policy | Constant | Behavior |
|--------|----------|----------|
| Overwrite | `Overwrite` | Replace existing files without prompting |
| Preserve | `Preserve` | Keep existing files, skip rendering (default) |
| Prompt | `Prompt` | Ask user for each file conflict |

**Example Settings Map:**
```rhai
let settings = #{
    if_exists: Overwrite  // or Preserve, or Prompt
};
```

## Usage Patterns

### Basic Directory Rendering

```rhai
// Method-style: create once, render multiple times
let contents = Directory("contents/basic-app");
let context = #{
    app_name: "todo-app",
    author: "Developer"
};
contents.render(context);

// Function-style: one-time rendering
render(Directory("contents/basic-app"), #{
    app_name: "todo-app",
    author: "Developer"
});
```

### Conditional Rendering with Settings

```rhai
// Render with overwrite protection
let api_contents = Directory("contents/rest-api");
let context = #{
    service_name: "user-service",
    database_type: "postgres"
};
let settings = #{
    if_exists: Preserve  // Don't overwrite existing files
};
api_contents.render(context, settings);
```

### Multiple Destination Rendering

```rhai
// Method-style: reuse Directory instance for multiple renders
let shared_contents = Directory("contents/shared");
let contexts = [
    #{ service: "auth", port: 3001 },
    #{ service: "users", port: 3002 },
    #{ service: "orders", port: 3003 }
];

for ctx in contexts {
    let dest = `./services/${ctx.service}`;
    shared_contents.render(dest, ctx);
}

// Function-style alternative: inline for each service
let services = ["auth", "users", "orders"];
for (i, service) in services.enumerate() {
    let port = 3001 + i;
    render(Directory("contents/shared"), `./services/${service}`, #{
        service: service,
        port: port
    });
}
```

### Environment-Specific Configuration

```rhai
// Method-style: efficient for multiple environments
let config_contents = Directory("contents/config");
let environments = ["development", "staging", "production"];

for env in environments {
    let context = #{
        environment: env,
        debug_enabled: env == "development",
        log_level: if env == "production" { "error" } else { "debug" }
    };
    
    let dest_path = Path(`./config/${env}`);
    let settings = #{
        if_exists: Overwrite  // Always update configs
    };
    
    config_contents.render(dest_path, context, settings);
}

// Function-style: direct rendering per environment  
render(Directory("contents/config"), Path("./config/development"), #{
    environment: "development",
    debug_enabled: true,
    log_level: "debug"
}, #{ if_exists: Overwrite });

render(Directory("contents/config"), Path("./config/production"), #{
    environment: "production", 
    debug_enabled: false,
    log_level: "error"
}, #{ if_exists: Overwrite });
```

## Error Handling

Directory rendering operations return errors for:
- Invalid source directory paths
- Permission issues with destination directories
- Template syntax errors
- Invalid context variables

**Example with error handling:**
```rhai
try {
    let dir = Directory("contents/project");
    let context = #{ name: "test-project" };
    dir.render(context);
    print("✓ Directory rendered successfully");
} catch (error) {
    print(`✗ Error rendering directory: ${error}`);
}
```

## Best Practices

:::tip Path Security
Directory operations automatically prevent path traversal attacks. All paths are validated and restricted to safe locations.
:::

:::note Content Processing
- All files are processed as content with Jinja templating regardless of extension
- Binary files are automatically detected and copied without content processing
- Use appropriate file extensions for better IDE support
:::

:::warning Overwrite Policies
- Default policy is `Preserve` to prevent accidental overwrites
- Use `Overwrite` carefully in production environments
- `Prompt` policy is useful for interactive archetype execution
:::