---
sidebar_position: 1
---

# User Guide

This section covers everything you need to know about using Archetect effectively in your daily development workflow. Whether you're generating projects from existing archetypes or working with advanced features, you'll find comprehensive guidance here.

## What You'll Learn

- **[CLI Reference](./cli-reference)**: Complete command-line interface documentation
- **[Working with Archetypes](./archetypes)**: Finding, using, and managing archetypes
- **[Catalogs](./catalogs)**: Browse and use archetype collections

## Quick Reference

### Essential Commands
```bash
# Generate a project
archetect render <archetype> <destination>

# Browse a catalog
archetect catalog <catalog-url>

# Check system status
archetect system info

# Manage cache
archetect cache list
archetect cache clear
```

### Common Workflows
- **[Quick Generation](./archetypes#quick-generation)**: Generate projects quickly
- **[Interactive Browsing](./catalogs#interactive-browsing)**: Explore available archetypes

## Getting Help

If you need assistance while using Archetect:

```bash
# General help
archetect --help

# Command-specific help
archetect render --help
archetect catalog --help

# System diagnostics
archetect system info
archetect check
```

## Best Practices

- **Use version constraints** in your archetype dependencies
- **Cache frequently used archetypes** for offline work
- **Create answer files** for repeatable project generation
- **Organize your work** with consistent naming conventions
- **Keep configurations minimal** and environment-specific

Ready to dive deeper? Start with the [CLI Reference](./cli-reference) to learn about all available commands and options.