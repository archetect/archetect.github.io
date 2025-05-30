---
sidebar_position: 3
---

# Working with Archetypes

This guide covers everything you need to know about finding, using, and managing archetypes in your daily development workflow. You'll learn how to discover archetypes, generate projects efficiently, and customize the generation process.

## Understanding Archetypes

### What are Archetypes?

Archetypes are project templates that combine:
- **File and directory structure** - The skeleton of your project
- **Template files** - Dynamic content with placeholders
- **Interactive scripts** - Logic for gathering user input and customizing generation
- **Configuration** - Metadata and generation rules

### Archetype Sources

Archetypes can come from various sources:

```bash
# Git repositories (most common) - creates '<project-name>/' directory
archetect render https://github.com/user/my-archetype.git <project-name>

# Local directories (for development) - generates complete project in destination
archetect render ./local-archetype <project-name>

# Catalog entries (organized collections)
archetect catalog https://github.com/archetect/catalog.git

# Action shortcuts (configured in ~/.archetect/config.yaml)
archetect render rust-cli <project-name>
```

## Quick Generation

### Basic Generation Workflow

The simplest way to generate a project:

```bash
# 1. Choose an archetype source
# 2. Specify destination directory
# 3. Follow interactive prompts
archetect render <archetype-source> <destination>
```

**Example:**
```bash
archetect render https://github.com/archetect/rust-cli.git my-cli-tool
```

This will:
1. Download and cache the archetype
2. Start an interactive session
3. Prompt for project configuration
4. Generate the entire project in `my-cli-tool/` directory

### Pre-filling Answers

Speed up generation by providing answers upfront:

```bash
# Individual answers - creates complete project in 'my-project/' directory
archetect render archetype-url my-project \
  -a project_name="my-awesome-project" \
  -a author_name="John Doe" \
  -a license="MIT"

# Answer file - entire project structure generated in destination directory
archetect render archetype-url my-project \
  -A answers.yaml
```

**Example answer file:**
```yaml
# answers.yaml
project_name: "my-awesome-project"
description: "An awesome project generated with Archetect"
author_name: "John Doe"
author_email: "john@example.com"
features:
  - "database"
  - "authentication"
  - "logging"
license: "MIT"
rust_edition: "2021"
```

### Using Switches

Enable optional features with switches:

```bash
# Enable specific features
archetect render archetype my-project \
  -s testing \
  -s documentation \
  -s docker

# Multiple switches
archetect render archetype my-project \
  --switches testing,documentation,docker
```

Switches are archetype-specific and control:
- Optional template inclusion
- Feature toggles in scripts
- Conditional logic paths

## Advanced Generation Techniques

### Headless Mode

Generate projects without interactive prompts (perfect for CI/CD):

```bash
# All answers must be provided via -a or -A
archetect render archetype my-project \
  --headless \
  -A complete-answers.yaml
```

**Requirements for headless mode:**
- All required answers must be pre-filled
- No validation errors can occur
- All conditional prompts must have defaults or be skipped

### Dry Run Mode

Preview what will be generated without creating files:

```bash
archetect render archetype my-project --dry-run
```

This shows:
- Files that would be created
- Variables that would be set
- Templates that would be processed
- Any errors in configuration

### Force Mode

Overwrite existing files without prompting:

```bash
# Dangerous! Will overwrite existing files
archetect render archetype existing-project --force
```

**Use cases:**
- Updating generated projects (use with caution)
- Re-generating after archetype changes
- Batch processing scenarios

### Local Development Mode

Work with local archetype copies during development:

```bash
# Use local archetype without caching
archetect render ./my-archetype test-project --local

# Bypass Git operations
archetect render ./my-archetype test-project -l
```

Benefits:
- Immediate feedback during archetype development
- No network dependency
- Faster iteration cycles

## Finding and Discovering Archetypes

### Official Catalogs

Browse curated collections of archetypes:

```bash
# Browse official catalog
archetect catalog

# Browse specific catalog
archetect catalog https://github.com/archetect/catalog.git

# Filter by language or framework
archetect catalog --filter rust
archetect catalog --filter react
```

### GitHub Search

Find archetypes on GitHub:

```bash
# Search for "archetect" repositories
# Look for repositories with archetype.yaml files
# Check topics: "archetect", "archetype", "template"
```

### Community Resources

- **Awesome Archetect** - Curated list of community archetypes
- **GitHub Topics** - Search `#archetect` and `#archetype`
- **Language-specific collections** - Rust, JavaScript, Python communities

### Archetype Quality Indicators

When evaluating archetypes, look for:

✅ **Good Signs:**
- Recent commits and active maintenance
- Clear documentation and README
- Example usage and screenshots
- Comprehensive archetype.yaml metadata
- Test files and validation scripts

❌ **Warning Signs:**
- No commits in 6+ months
- Missing documentation
- No archetype.yaml file
- Overly complex or unclear purpose
- No examples or test cases

## Managing Archetype Cache

### Cache Operations

Archetect caches downloaded archetypes for offline use:

```bash
# View cached archetypes
archetect cache list

# Clear all cache
archetect cache clear

# Clear specific archetype
archetect cache clear --pattern "github.com/user/repo"

# Cache statistics
archetect cache info
```

### Cache Benefits

- **Offline usage** - Generate projects without internet
- **Faster generation** - No re-downloading
- **Version consistency** - Cached versions don't change unexpectedly

### Cache Strategies

```bash
# Update cache explicitly
archetect render archetype project --update

# Force cache refresh
archetect render archetype project -U

# Work offline only
archetect render archetype project --offline
```

## Archetype Configuration

### User-level Configuration

Configure default values and shortcuts:

```yaml
# ~/.archetect/config.yaml
defaults:
  author_name: "Your Name"
  author_email: "your.email@example.com"
  license: "MIT"
  
actions:
  rust-cli: "https://github.com/archetect/rust-cli.git"
  react-app: "https://github.com/archetect/react-app.git"
  microservice: "https://github.com/company/microservice.git"
```

### Project-level Answers

Create reusable answer files for project types:

```yaml
# configs/rust-microservice.yaml
project_type: "microservice"
framework: "axum"
database_type: "postgresql"
auth_provider: "auth0"
features:
  - "database"
  - "auth"
  - "logging"
  - "metrics"
  - "docker"
deployment_target: "kubernetes"
```

### Environment-specific Configuration

```bash
# Development environment
export ARCHETECT_AUTHOR="Dev Team"
export ARCHETECT_LICENSE="Proprietary"

# Production/CI environment
export ARCHETECT_OFFLINE=true
export ARCHETECT_HEADLESS=true
```

## Troubleshooting Generation Issues

### Common Problems

**Network Issues:**
```bash
# Work offline if network is unreliable
archetect render archetype project --offline

# Clear cache and retry
archetect cache clear
archetect render archetype project
```

**Permission Errors:**
```bash
# Check write permissions
ls -la .

# Ensure destination directory is writable
mkdir my-project
chmod 755 my-project
archetect render archetype my-project
```

**Template Errors:**
```bash
# Use verbose output for debugging
archetect render archetype project --verbose

# Try dry run first
archetect render archetype project --dry-run
```

**Validation Failures:**
```bash
# Check required vs provided answers
archetect render archetype project --dry-run

# Use answer file for complex configurations
archetect render archetype project -A answers.yaml
```

### Debug Mode

Enable detailed logging:

```bash
export ARCHETECT_LOG_LEVEL=debug
archetect render archetype project
```

### Getting Help

```bash
# General help
archetect --help

# Command-specific help
archetect render --help

# System diagnostics
archetect system info
archetect check
```

## Best Practices

### For Users

1. **Test First** - Always try dry run mode first
2. **Use Answer Files** - Create reusable configurations
3. **Version Control** - Keep answer files in version control
4. **Cache Management** - Clear cache periodically
5. **Documentation** - Document your project-specific configurations

### For Teams

1. **Shared Configurations** - Maintain team answer files
2. **Standard Archetypes** - Agree on standard archetypes for common project types
3. **CI/CD Integration** - Use headless mode in automated workflows
4. **Custom Actions** - Set up team-specific action shortcuts
5. **Regular Updates** - Keep archetype cache fresh

### Performance Tips

1. **Local Development** - Use local mode during development
2. **Batch Operations** - Process multiple projects efficiently
3. **Cache Preloading** - Pre-populate cache for offline work
4. **Answer File Optimization** - Keep answer files minimal and focused

This comprehensive guide should help you work effectively with archetypes in any scenario, from quick prototyping to complex enterprise project generation.