# Archetect Configuration

Archetect uses YAML as its configuration format. Configuration files can use either `.yaml` or `.yml` file extensions and are processed in a specific order to allow for flexible deployment scenarios.

## File Names and Locations

Archetect looks for configuration files in the following locations (in order of precedence):

1. **System Configuration**: `~/.archetect/archetect.yaml`
2. **Additional System Config**: `~/.archetect/etc.d/*.yaml` and `~/.archetect/etc.d/*.yml` (loaded alphabetically)
3. **Local Project Configuration**: `.archetect.yaml` or `.archetect.yml` in current directory
4. **Project Configuration**: `archetect.yaml` or `archetect.yml` in current directory
5. **Command Line Specified**: Via `--config-file` argument

:::info
Later configuration sources override earlier ones, allowing for flexible configuration layering.
:::

## Complete Configuration Example

```yaml title="archetect.yaml"
# Core settings
offline: false # Run in offline mode (default: false)
headless: false # Run without interactive prompts (default: false)

# Actions define available commands/workflows
actions:
  default: # Special action - runs when no action is specified
    group:
      description: "Archetect"
      entries:
        - catalog:
            description: "Archetect Catalog"
            source: "https://github.com/archetect/archetect.catalog.git"

  custom_action:
    archetype:
      description: "Custom Archetype"
      source: "https://example.com/custom.git"
      answers: # Pre-filled answers
        project_name: "my-project"
      switches: # Enabled switches
        - "feature_flag"
      use_defaults: # Use defaults for specific prompts
        - "version"
      use_defaults_all: false

# Global answers for all archetypes
answers:
  author_name: "John Doe"
  author_email: "john@doe.com"
  author_full: "John Doe <john@doe.com>"
  organization: "ACME Corp"

# Update configuration
updates:
  force: false # Force updates (default: false)
  interval: 604800 # Update interval in seconds (default: 1 week)

# Local archetype development
locals:
  enabled: false # Enable local archetypes (default: false)
  paths:
    - "~/projects/archetypes/"

# Global switches
switches:
  - "debug_mode"
  - "verbose_output"
```

## Configuration Sections

### Core Settings

Basic operational settings for Archetect:

```yaml
offline: false # Run in offline mode
headless: false # Skip interactive prompts
```

### Actions

Actions define available commands and workflows. Three types are supported:

:::info Default Action
The action named `default` is special - it executes automatically when Archetect is run without specifying an action name.
:::

#### Group Actions

Collections of related actions:

```yaml
actions:
  development:
    group:
      description: "Development Tools"
      entries:
        - catalog:
            description: "Web Frameworks"
            source: "https://github.com/example/web.catalog.git"
        - archetype:
            description: "API Service"
            source: "https://github.com/example/api-service.git"
```

#### Catalog Actions

Point to catalogs containing multiple archetypes:

```yaml
actions:
  frameworks:
    catalog:
      description: "Framework Catalog"
      source: "https://github.com/example/frameworks.catalog.git"
```

#### Archetype Actions

Point directly to specific archetypes:

```yaml
actions:
  webapp:
    archetype:
      description: "Web Application"
      source: "https://github.com/example/webapp.git"
      answers:
        framework: "react"
        typescript: true
      switches:
        - "eslint"
        - "prettier"
      use_defaults:
        - "version"
      use_defaults_all: false
```

:::tip
Use `use_defaults` to automatically answer specific prompts with their default values, or `use_defaults_all: true` to use defaults for all prompts.
:::

### Answers

Global answers that apply to all archetypes:

```yaml
answers:
  author_name: "Your Name" # Often auto-populated from git config
  author_email: "you@email.com" # Often auto-populated from git config
  organization: "Your Org"
  license: "MIT"
  custom_key: "custom_value"
```

:::note
Author information is automatically populated from Git configuration if not specified.
:::

### Updates

Controls how Archetect handles updates to cached archetypes and catalogs:

```yaml
updates:
  force: false # Force updates even if cache is valid
  interval: 604800 # Update check interval in seconds (default: 1 week)
```

### Local Development

Configuration for local archetype development:

```yaml
locals:
  enabled: true # Enable local archetype discovery
  paths:
    - "~/dev/archetypes"
    - "/shared/archetypes"
```

:::warning
Local paths should point to directories containing archetype directories, not directly to archetype files.
:::

### Global Switches

Switches that can be referenced by any archetype:

```yaml
switches:
  - "debug_mode"
  - "verbose_output"
  - "development"
```

## Environment Variables

Configuration values can be overridden using environment variables with the `ARCHETECT_` prefix:

```bash
export ARCHETECT_OFFLINE=true
export ARCHETECT_HEADLESS=true
```

## Validation

Configuration files are validated for:

- Proper YAML syntax
- Required field presence
- Type correctness for all values
- Valid source URLs for actions

Invalid configuration will result in clear error messages indicating the specific issue and location.
