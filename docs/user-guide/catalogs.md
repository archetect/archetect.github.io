---
sidebar_position: 4
---

# Archetype Catalogs

Catalogs are organized collections of related archetypes that make it easy to discover and select the right template for your project. This guide covers how to browse, use, and create archetype catalogs.

## Understanding Catalogs

### What are Catalogs?

Catalogs are repositories that contain:
- **Multiple archetypes** organized by theme, language, or framework
- **Metadata and descriptions** for easy browsing
- **Hierarchical organization** with categories and tags
- **Search and filtering capabilities**

### Catalog Structure

```
catalog/
├── catalog.yaml              # Catalog metadata
├── rust/                     # Language-specific category
│   ├── cli/                  # Framework-specific subcategory
│   │   ├── archetype.yaml
│   │   └── template/
│   ├── web-service/
│   └── library/
├── javascript/
│   ├── react-app/
│   ├── node-api/
│   └── express-server/
└── python/
    ├── django-app/
    ├── fastapi-service/
    └── cli-tool/
```

### Catalog Benefits

- **Discoverability** - Find relevant archetypes quickly
- **Organization** - Related templates grouped together
- **Quality** - Curated collections with consistent standards
- **Maintenance** - Centralized updates and improvements

## Interactive Browsing

### Basic Catalog Navigation

Start browsing a catalog interactively:

```bash
# Browse the official Archetect catalog
archetect catalog

# Browse a specific catalog
archetect catalog https://github.com/archetect/catalog.git

# Browse local catalog
archetect catalog ./my-catalog
```

### Interactive Menu Navigation

When you run `archetect catalog`, you'll see a menu like:

```
📚 Archetect Catalog

Select a category:
❯ 🦀 Rust (12 archetypes)
  🌐 Web Development (8 archetypes)  
  📱 Mobile (4 archetypes)
  🐍 Python (6 archetypes)
  📊 Data Science (3 archetypes)
  🔧 DevOps (5 archetypes)

Navigation: ↑↓ to move, Enter to select, q to quit
```

Drill down through categories:

```
🦀 Rust Archetypes

❯ CLI Application - Command-line tools with clap
  Web Service - Axum-based web services
  Library - Rust library with documentation
  WebAssembly - WASM projects for web
  Embedded - No-std embedded applications

Press Enter to generate, 'i' for info, 'b' to go back
```

### Archetype Information

View detailed information about any archetype:

```bash
# Press 'i' in interactive mode, or:
archetect catalog info rust/cli

# View all archetypes in category
archetect catalog list rust/
```

Example output:
```
🦀 Rust CLI Application

Description: Modern command-line application with clap argument parsing
Authors: Archetect Team
Version: 2.1.0
Languages: Rust
Frameworks: clap, tokio, serde
Tags: cli, command-line, async

Features:
✅ Argument parsing with clap
✅ Async runtime with tokio  
✅ Configuration file support
✅ Structured logging
✅ Error handling
✅ Shell completions
✅ Cross-platform builds

Requirements:
- Rust 1.70+
- Git (for version control)

Last updated: 2 days ago
⭐ Highly recommended
```

## Filtering and Search

### Language Filtering

Filter catalogs by programming language:

```bash
# Show only Rust archetypes
archetect catalog --filter rust

# Multiple languages
archetect catalog --filter "rust,python,go"

# Case insensitive
archetect catalog --filter RUST
```

### Framework Filtering

Filter by framework or library:

```bash
# Web frameworks
archetect catalog --filter react
archetect catalog --filter "express,fastapi"

# Development tools
archetect catalog --filter docker
archetect catalog --filter kubernetes
```

### Tag-based Filtering

Use tags for more specific filtering:

```bash
# Find CLI tools
archetect catalog --filter cli

# Web APIs
archetect catalog --filter api

# Full-stack applications
archetect catalog --filter fullstack

# Combine multiple tags
archetect catalog --filter "api,database,auth"
```

### Search Functionality

Search in descriptions and metadata:

```bash
# Search for specific terms
archetect catalog --search "microservice"
archetect catalog --search "machine learning"

# Combine search with filters
archetect catalog --filter python --search "web scraping"
```

## Non-Interactive Usage

### List All Archetypes

Get a comprehensive list without interaction:

```bash
# List all archetypes
archetect catalog list

# List with details
archetect catalog list --verbose

# Export to JSON
archetect catalog list --format json > catalog.json
```

### Direct Selection

Generate directly from catalog without browsing:

```bash
# Use full path
archetect render catalog://rust/cli my-cli-tool

# With catalog URL
archetect render catalog://github.com/archetect/catalog.git/rust/web-service my-api

# Using action shortcut (if configured)
archetect render rust-cli my-tool
```

### Batch Operations

Process multiple archetypes programmatically:

```bash
#!/bin/bash
# Generate multiple microservices

services=("user-service" "order-service" "payment-service")
catalog="catalog://microservices/rust-service"

for service in "${services[@]}"; do
  archetect render "$catalog" "$service" \
    --headless \
    -a service_name="$service" \
    -a database_type="postgresql" \
    -A configs/microservice-defaults.yaml
done
```

## Working with Catalog Sources

### Catalog URLs

Catalogs can be hosted in various locations:

```bash
# Git repositories (GitHub, GitLab, etc.)
archetect catalog https://github.com/company/archetypes.git

# Local directories
archetect catalog ./local-catalog

# HTTP archives (less common)
archetect catalog https://example.com/catalog.tar.gz
```

### Configuring Default Catalogs

Set up frequently used catalogs:

```yaml
# ~/.archetect/config.yaml
catalogs:
  official: "https://github.com/archetect/catalog.git"
  company: "https://github.com/company/archetypes.git"
  local: "./dev-catalogs"

# Use with shortcuts
actions:
  rust-cli: "catalog://official/rust/cli"
  company-api: "catalog://company/api-template"
```

### Catalog Caching

Catalogs are cached like individual archetypes:

```bash
# Update catalog cache
archetect catalog update

# Clear catalog cache
archetect cache clear --catalogs

# Work offline
archetect catalog --offline
```

## Creating Your Own Catalogs

### Catalog Structure

Create a catalog repository:

```
my-catalog/
├── catalog.yaml              # Catalog metadata
├── web/
│   ├── react-app/
│   │   ├── archetype.yaml
│   │   └── template/
│   └── vue-app/
│       ├── archetype.yaml
│       └── template/
├── api/
│   ├── rest-api/
│   └── graphql-api/
└── mobile/
    ├── react-native/
    └── flutter/
```

### Catalog Configuration

Define catalog metadata:

```yaml
# catalog.yaml
name: "Company Development Catalog"
description: "Standard project templates for our development team"
version: "1.0.0"
authors:
  - "Platform Team <platform@company.com>"

categories:
  web:
    name: "Web Applications"
    description: "Frontend and full-stack web applications"
    icon: "🌐"
  
  api:
    name: "API Services"
    description: "Backend APIs and microservices"
    icon: "🔌"
  
  mobile:
    name: "Mobile Applications"
    description: "iOS, Android, and cross-platform mobile apps"
    icon: "📱"

tags:
  - name: "production-ready"
    description: "Templates ready for production use"
  - name: "experimental"
    description: "Experimental or beta templates"

# Global defaults for all archetypes
defaults:
  author_organization: "Your Company"
  license: "MIT"
  deployment_target: "kubernetes"
```

### Archetype Registration

Each archetype needs proper metadata:

```yaml
# web/react-app/archetype.yaml
description: "Modern React application with TypeScript and testing"
category: "web"
tags: ["react", "typescript", "production-ready"]
languages: ["TypeScript", "JavaScript"]
frameworks: ["React", "Vite", "Testing Library"]

# Version and maintenance info
version: "2.1.0"
archetect_version: "^2.0.0"
last_updated: "2024-01-15"

# Difficulty and time estimates
difficulty: "beginner"
estimated_time: "5 minutes"

# Feature highlights
features:
  - "TypeScript configuration"
  - "Vite build system"
  - "ESLint and Prettier"
  - "Jest testing setup"
  - "Component library integration"
  - "CI/CD pipeline"
```

### Publishing Catalogs

Make your catalog available to others:

```bash
# 1. Create Git repository
git init
git add .
git commit -m "Initial catalog"

# 2. Push to hosting service
git remote add origin https://github.com/company/archetypes.git
git push -u origin main

# 3. Add tags for releases
git tag v1.0.0
git push --tags

# 4. Document usage
echo "archetect catalog https://github.com/company/archetypes.git" > README.md
```

## Team and Enterprise Usage

### Organizational Catalogs

Set up catalogs for your organization:

```yaml
# Company-wide configuration
# ~/.archetect/config.yaml (distributed to team)
catalogs:
  company: "https://github.com/company/archetypes.git"
  official: "https://github.com/archetect/catalog.git"

defaults:
  author_organization: "Company Name"
  license: "Proprietary"
  
actions:
  api: "catalog://company/microservice"
  frontend: "catalog://company/react-app"
  mobile: "catalog://company/react-native"
```

### Catalog Governance

Establish processes for catalog management:

1. **Review Process** - All new archetypes reviewed before inclusion
2. **Version Control** - Use semantic versioning for catalog releases
3. **Testing** - Automated testing of all archetypes
4. **Documentation** - Comprehensive README and usage examples
5. **Maintenance** - Regular updates and dependency management

### Private Catalogs

Host catalogs securely for internal use:

```bash
# Private Git repositories
archetect catalog git@github.com:company/private-archetypes.git

# Internal hosting
archetect catalog https://archetypes.internal.company.com/catalog.git

# Access control via Git permissions
# Authentication handled by Git credentials
```

## Troubleshooting

### Common Issues

**Catalog Not Found:**
```bash
# Check URL and network connectivity
archetect catalog https://github.com/user/catalog.git --verbose

# Verify Git access
git clone https://github.com/user/catalog.git temp-test
```

**Outdated Catalog:**
```bash
# Force update
archetect catalog update --force

# Clear cache and reload
archetect cache clear
archetect catalog https://github.com/user/catalog.git
```

**Permission Issues:**
```bash
# Check Git credentials
git config --global credential.helper

# Use SSH if HTTPS fails
archetect catalog git@github.com:user/catalog.git
```

### Performance Optimization

```bash
# Pre-populate cache
archetect catalog cache-all https://github.com/company/catalog.git

# Use local mirrors
git clone --mirror https://github.com/company/catalog.git ./catalog-mirror
archetect catalog ./catalog-mirror
```

Catalogs provide a powerful way to organize and distribute archetypes at scale, making it easy for teams and communities to share and discover project templates.