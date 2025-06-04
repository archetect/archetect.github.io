---
sidebar_label: Configuration
sidebar_position: 3
---

# Configuration

This section provides comprehensive reference documentation for all Archetect configuration options and settings.

## Overview

Archetect uses a flexible configuration system that supports multiple levels of customization, from global settings to archetype-specific manifests. Configuration can be specified in YAML, JSON, or TOML formats depending on the context.

## Configuration Types

### [Archetype Manifest](./archetype-manifest)

The archetype manifest (`archetype.yaml` or `archetype.yml`) is the heart of every archetype. This required file defines:

- Archetype metadata and description
- Requirements and dependencies
- Behavior and rendering options
- Integration with catalogs

Every archetype must have a manifest file in its root directory, or Archetect will throw an error.

### [Archetect Configuration](./archetect-configuration)

Global and project-level settings that control how Archetect behaves. Configuration files are loaded in a specific precedence order:

1. System-wide configuration (`~/.archetect/archetect.yaml`)
2. Additional system configs (`~/.archetect/etc.d/`)
3. Local project configs (`.archetect.yaml` or `archetect.yaml`)
4. Command-line specified config (`--config-file`)

Later sources override earlier ones, providing flexible configuration layering.

### [Answer Files](./answer-files)

Answer files enable automation by pre-populating responses to archetype prompts. They are essential for:

- Non-interactive archetype rendering
- Ensuring consistency across multiple generations
- CI/CD pipeline integration
- Batch operations
- Creating reusable configuration sets

Answer files support YAML, JSON, and TOML formats, making them easy to integrate with existing tooling.

## Configuration Best Practices

- **Use answer files** for repeated archetype generations to ensure consistency
- **Layer configurations** appropriately - global defaults with project-specific overrides
- **Version control** your project-level configuration files
- **Document** custom configuration options in your archetype manifests
- **Validate** configuration files before deploying archetypes to production
