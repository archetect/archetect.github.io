---
sidebar_position: 4
---

# Quick Start Tutorial

This tutorial will walk you through generating your first project with Archetect in just a few minutes. We'll create a simple Rust CLI application to demonstrate the core workflow.

## Before You Begin

Make sure you have:
- [Archetect installed](./installation)
- Git available in your PATH
- Basic familiarity with command-line operations

## Step 1: Your First Generation

Let's generate a simple project using a built-in archetype:

```bash
# Generate a new Rust CLI project
archetect render https://github.com/archetect/rust-cli-archetype.git my-awesome-cli
```

This command:
- Downloads the archetype from GitHub
- Prompts you for project configuration
- Generates the entire project including the containing directory
- The project name becomes part of the directory structure

## Step 2: Interactive Prompts

Archetect will ask you several questions to customize your project. Here's what you might see:

```
📝 Project name: my-awesome-cli
📝 Description: A demonstration CLI application
📝 Author name: Your Name
📝 Author email: your.email@example.com
📝 Select CLI framework:
   1. clap (recommended)
   2. structopt (legacy)
   3. argh (minimal)
🎯 Choice: 1

📝 Include features:
   [x] Colorized output
   [x] Configuration file support
   [ ] Logging framework
   [x] Shell completions
✅ Confirmed selections

📝 License:
   1. MIT
   2. Apache-2.0
   3. GPL-3.0
   4. None
🎯 Choice: 1
```

Answer the prompts based on your preferences. Don't worry - you can always modify the generated code later.

## Step 3: Explore the Generated Project

Navigate to your new project and explore what was created:

```bash
cd my-awesome-cli
ls -la
```

You should see a structure like:
```
my-awesome-cli/                 # Root directory with variable name
├── Cargo.toml              # Rust project configuration
├── README.md               # Project documentation
├── LICENSE                 # License file
├── .gitignore             # Git ignore rules
├── src/
│   ├── main.rs            # Main application entry point
│   ├── cli.rs             # Command-line interface definition
│   └── config.rs          # Configuration handling
├── tests/
│   └── integration_test.rs # Integration tests
└── .github/
    └── workflows/
        └── ci.yml         # CI/CD pipeline
```

## Step 4: Build and Run Your Project

Test that everything works correctly:

```bash
# Build the project
cargo build

# Run the application
cargo run -- --help
```

You should see help output for your new CLI application:

```
A demonstration CLI application

Usage: my-awesome-cli [OPTIONS] <COMMAND>

Commands:
  run     Run the main application logic
  config  Manage configuration
  help    Print this message or the help of the given subcommand(s)

Options:
  -v, --verbose    Enable verbose output
  -q, --quiet      Suppress output
  -h, --help       Print help
  -V, --version    Print version
```

## Step 5: Understanding What Happened

Let's examine how Archetect generated this project:

### Templates Were Processed
The archetype contained template files like:
```rust
// src/main.rs template
use clap::Parser;

mod cli;
mod config;

use cli::Cli;

fn main() {
    let cli = Cli::parse();
    
    match cli.command {
        cli::Commands::Run { file } => {
            println!("Running {{ project_name }} with file: {:?}", file);
        },
        cli::Commands::Config { action } => {
            config::handle_config(action);
        }
    }
}
```

### Variables Were Substituted
- `{{ project_name }}` became `my-awesome-cli`
- `{{ description }}` became your provided description
- `{{ author_name }}` and `{{ author_email }}` were filled in

### Conditional Logic Was Applied
Based on your selections:
- The chosen CLI framework was configured
- Selected features were included/excluded
- The appropriate license was added

## Step 6: Try Different Options

Let's generate another project with different choices:

```bash
cd ..
archetect render https://github.com/archetect/rust-cli-archetype.git minimal-cli
```

Note: The archetype generates the complete project structure within the `minimal-cli` directory, which becomes the project root.

This time, try:
- Different CLI framework
- Minimal feature set
- Different license

Compare the two generated projects to see how your choices affected the output.

## Advanced: Using Answer Files

For reproducible builds or CI/CD, you can pre-define answers:

```bash
# Create an answer file
cat > answers.yaml << EOF
project_name: "scripted-cli"
description: "Generated with predefined answers"
author_name: "CI Bot"
author_email: "ci@example.com"
cli_framework: "clap"
features: ["config", "completions"]
license: "MIT"
EOF

# Generate using the answer file
archetect render -A answers.yaml https://github.com/archetect/rust-cli-archetype.git scripted-cli
```

## Working with Local Archetypes

You can also work with local archetype directories:

```bash
# Clone an archetype for local development
git clone https://github.com/archetect/rust-cli-archetype.git

# Generate from local directory
archetect render ./rust-cli-archetype local-project
```

## Next Steps

Congratulations! You've successfully generated your first project with Archetect. Here's what to explore next:

### Learn More About Using Archetypes
- [Common Workflows](./workflows) - Essential patterns for daily use
- [CLI Reference](../user-guide/cli-reference) - Complete command documentation
- [Working with Catalogs](../user-guide/catalogs) - Browse collections of archetypes

### Start Creating Your Own
- [Authoring Guide](../authoring/) - Create custom archetypes
- [Templating](../authoring/templating) - Learn the templating language
- [Scripting](../authoring/scripting) - Add interactive logic with Rhai

### Join the Community
- [GitHub Repository](https://github.com/archetect/archetect) - Source code and issues
- [Example Archetypes](https://github.com/archetect) - Browse community templates
- [Contributing Guide](https://github.com/archetect/archetect/blob/main/CONTRIBUTING.md) - Help improve Archetect

## Troubleshooting

### Generation Failed
If generation fails, try:
```bash
# Check your internet connection
archetect system info

# Clear cache and retry
archetect cache clear
archetect render <archetype> <destination>
```

### Permission Errors
On Unix systems, ensure you have write permissions:
```bash
# Create directory with proper permissions
mkdir my-project
chmod 755 my-project
archetect render <archetype> my-project
```

### Template Errors
If you encounter template errors, verify the archetype source:
```bash
# Check if archetype repository is accessible
git clone <archetype-url> temp-check
rm -rf temp-check
```