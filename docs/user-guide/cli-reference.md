---
sidebar_position: 2
---

# CLI Reference

This comprehensive reference covers all Archetect commands, options, and usage patterns.

## Global Options

These options are available for all commands:

```bash
archetect [GLOBAL_OPTIONS] <COMMAND> [COMMAND_OPTIONS]
```

### Global Flags
- `--help, -h`: Show help information
- `--version, -V`: Display version information
- `--verbose, -v`: Enable verbose output
- `--quiet, -q`: Suppress non-essential output
- `--offline, -o`: Work in offline mode (use cached resources only)

## Commands

### `render`

Generate code from an archetype.

```bash
archetect render [OPTIONS] <ARCHETYPE> [DESTINATION]
```

#### Arguments
- `<ARCHETYPE>`: Archetype source (URL, path, or registered name)
- `[DESTINATION]`: Output directory (defaults to current directory)

#### Options
- `--answers, -a <KEY=VALUE>`: Set individual answer values
- `--answer-file, -A <FILE>`: Load answers from YAML file
- `--switches, -s <SWITCH>`: Enable conditional switches
- `--force, -f`: Overwrite existing files without prompting
- `--update, -U`: Force update cached resources
- `--local, -l`: Use local development mode
- `--headless`: Run in non-interactive mode (requires all answers)
- `--dry-run`: Show what would be generated without creating files

#### Examples

```bash
# Basic generation - creates 'my-project/' directory with complete project
archetect render https://github.com/user/archetype.git my-project

# With inline answers - project name becomes root directory
archetect render -a name=myapp -a version=1.0.0 archetype my-project

# Using answer file - entire project generated in 'my-project/' directory
archetect render -A config.yaml archetype my-project

# With switches enabled - project structure created in 'my-project/'
archetect render -s testing -s documentation archetype my-project

# Force overwrite existing files in 'existing-project/' directory
archetect render --force archetype existing-project

# Dry run to preview generation in 'preview/' directory
archetect render --dry-run archetype preview
```

### `catalog`

Browse and select from archetype catalogs.

```bash
archetect catalog [OPTIONS] [CATALOG]
```

#### Arguments
- `[CATALOG]`: Catalog URL or registered name (defaults to interactive selection)

#### Options
- `--list, -l`: List available archetypes without interactive menu
- `--filter, -f <PATTERN>`: Filter archetypes by name or tag
- `--update, -U`: Force update catalog cache

#### Examples

```bash
# Interactive catalog browsing
archetect catalog https://github.com/archetect/catalog.git

# List all archetypes
archetect catalog --list official

# Filter by pattern
archetect catalog --filter rust official
```

### `cache`

Manage cached Git repositories and resources.

```bash
archetect cache <SUBCOMMAND>
```

#### Subcommands

##### `list`
List all cached resources.
```bash
archetect cache list [OPTIONS]

Options:
  --verbose, -v    Show detailed information
  --size           Show cache sizes
```

##### `clear`
Clear cached resources.
```bash
archetect cache clear [OPTIONS]

Options:
  --all, -a        Clear all cached data
  --git            Clear only Git repositories
  --http           Clear only HTTP resources
  --pattern <GLOB> Clear resources matching pattern
```

##### `info`
Show cache information and statistics.
```bash
archetect cache info
```

#### Examples

```bash
# List all cached items
archetect cache list

# Show detailed cache information
archetect cache list --verbose --size

# Clear all cache
archetect cache clear --all

# Clear specific pattern
archetect cache clear --pattern "github.com/user/*"
```

### `config`

Manage user configuration.

```bash
archetect config <SUBCOMMAND>
```

#### Subcommands

##### `show`
Display current configuration.
```bash
archetect config show [OPTIONS]

Options:
  --path           Show configuration file path
  --defaults       Show default values
```

##### `set`
Set configuration values.
```bash
archetect config set <KEY> <VALUE>
```

##### `unset`
Remove configuration values.
```bash
archetect config unset <KEY>
```

##### `edit`
Open configuration file in editor.
```bash
archetect config edit
```

#### Examples

```bash
# Show current config
archetect config show

# Set default author
archetect config set author.name "Your Name"
archetect config set author.email "your.email@example.com"

# Add action shortcut
archetect config set actions.rust-cli "https://github.com/archetect/rust-cli.git"

# Edit config file
archetect config edit
```

### `system`

Display system information and diagnostics.

```bash
archetect system <SUBCOMMAND>
```

#### Subcommands

##### `info`
Show system information.
```bash
archetect system info
```

##### `paths`
Show important file system paths.
```bash
archetect system paths
```

#### Examples

```bash
# Show system info
archetect system info

# Show configuration paths
archetect system paths
```

### `actions`

List and manage configured actions.

```bash
archetect actions [OPTIONS]
```

#### Options
- `--verbose, -v`: Show detailed action information

#### Examples

```bash
# List all actions
archetect actions

# Show detailed action info
archetect actions --verbose
```

### `completions`

Generate shell completion scripts.

```bash
archetect completions <SHELL>
```

#### Arguments
- `<SHELL>`: Target shell (bash, fish, zsh, powershell)

#### Examples

```bash
# Generate bash completions
archetect completions bash > ~/.local/share/bash-completion/completions/archetect

# Generate zsh completions
archetect completions zsh > ~/.zfunc/_archetect

# Generate fish completions
archetect completions fish > ~/.config/fish/completions/archetect.fish
```

### `check`

Run environment and configuration diagnostics.

```bash
archetect check [OPTIONS]
```

#### Options
- `--fix`: Attempt to automatically fix issues
- `--verbose, -v`: Show detailed diagnostic information

#### Examples

```bash
# Basic health check
archetect check

# Detailed diagnostics
archetect check --verbose

# Attempt to fix issues
archetect check --fix
```

## Exit Codes

Archetect uses standard exit codes:

- `0`: Success
- `1`: General error
- `2`: Invalid usage/arguments
- `3`: Configuration error
- `4`: Network/connectivity error
- `5`: File system error
- `130`: Interrupted by user (Ctrl+C)

## Environment Variables

### Configuration
- `ARCHETECT_CONFIG_DIR`: Override default configuration directory
- `ARCHETECT_CACHE_DIR`: Override default cache directory

### Behavior
- `ARCHETECT_OFFLINE`: Force offline mode (`true`/`false`)
- `ARCHETECT_NO_COLOR`: Disable colored output (`true`/`false`)
- `ARCHETECT_LOG_LEVEL`: Set logging level (`error`, `warn`, `info`, `debug`, `trace`)

### Network
- `HTTP_PROXY`, `HTTPS_PROXY`: Configure proxy settings
- `NO_PROXY`: Define proxy bypass patterns

## Configuration File Format

The configuration file uses YAML format:

```yaml
# User defaults
defaults:
  author_name: "Your Name"
  author_email: "your.email@example.com"
  license: "MIT"

# Action shortcuts
actions:
  rust-cli: "https://github.com/archetect/rust-cli.git"
  react-app: "git://github.com/archetect/react-app.git"
  api: "~/dev/archetypes/api"

# Global settings
settings:
  offline_mode: false
  auto_update: true
  cache_ttl: 3600
  editor: "code"

# Security settings
security:
  allow_shell_execution: true
  trusted_domains:
    - "github.com"
    - "gitlab.com"
```

## Common Patterns

### Answer File Templates

Create reusable answer files for consistent project generation:

```yaml
# answers/rust-cli.yaml
project_name: "{{ project_name }}"
description: "{{ description }}"
author_name: "Your Name"
author_email: "your.email@example.com"
cli_framework: "clap"
features:
  - "config"
  - "logging"
  - "completions"
license: "MIT"
```

### Batch Generation

Generate multiple related projects:

```bash
#!/bin/bash
# generate-microservices.sh

services=("auth" "users" "orders" "payments")
archetype="https://github.com/company/microservice.git"

for service in "${services[@]}"; do
  archetect render \
    -a service_name="$service" \
    -a port="$((8000 + ${#service}))" \
    "$archetype" \
    "services/$service"
done
```

### CI/CD Integration

Use Archetect in automated pipelines:

```yaml
# .github/workflows/generate.yml
name: Generate Projects
on:
  workflow_dispatch:
    inputs:
      project_name:
        description: 'Project name'
        required: true

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Install Archetect
        run: |
          curl -L https://github.com/archetect/archetect/releases/latest/download/archetect-linux-x86_64.tar.gz | sudo tar xz -C /usr/local/bin
      
      - name: Generate Project
        run: |
          archetect render \
            --headless \
            -a project_name="${{ github.event.inputs.project_name }}" \
            -a author_name="GitHub Actions" \
            company/archetype \
            generated/${{ github.event.inputs.project_name }}
```

## Troubleshooting

### Common Issues

#### "Command not found"
```bash
# Check installation
which archetect
echo $PATH

# Reinstall if necessary
curl -L https://github.com/archetect/archetect/releases/latest/download/archetect-linux-x86_64.tar.gz | sudo tar xz -C /usr/local/bin
```

#### "Permission denied" 
```bash
# Check file permissions
ls -la $(which archetect)

# Fix permissions
sudo chmod +x $(which archetect)
```

#### Network/Git errors
```bash
# Check connectivity
archetect check

# Work offline
archetect render --offline cached-archetype project

# Clear and rebuild cache
archetect cache clear --all
```

#### Template errors
```bash
# Use verbose output for debugging
archetect render --verbose archetype project

# Try dry run first
archetect render --dry-run archetype project
```