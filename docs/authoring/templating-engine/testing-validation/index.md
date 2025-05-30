---
sidebar_position: 4
---

# Testing & Validation

Ensure your templates are robust, reliable, and generate correct output with comprehensive testing strategies, validation techniques, and debugging approaches.

## Template Validation

### 1. Syntax Validation

Create validation scripts to test your template syntax before deployment:

```rhai
// validate_templates.rhai

// Test data for template validation
let test_data = #{
    project_name: "test-project",
    author: #{
        name: "Test Author",
        email: "test@example.com"
    },
    features: ["database", "auth"],
    database_type: "postgresql"
};

// Set test variables
for key in test_data.keys() {
    set_variable(key, test_data[key]);
}

// Validate template syntax
let template_files = [
    "src/main.rs",
    "src/lib.rs",
    "Cargo.toml",
    "README.md"
];

for file in template_files {
    if !validate_template_syntax(file) {
        log::error("Template syntax error in " + file);
        return false;
    }
    log::info("✓ " + file + " syntax valid");
}

// Check for required variables
let required_vars = ["project_name", "author", "database_type"];
for var in required_vars {
    if !has_variable(var) {
        log::error("Missing required variable: " + var);
        return false;
    }
}

log::success("All templates validated successfully");
```

### 2. Variable Validation

Validate that all required variables are present and have valid values:

```jinja
{# includes/validation.jinja #}
{% macro validate_required(var_name, var_value) %}
{% if not var_value %}
  {% error var_name + " is required but not provided" %}
{% endif %}
{% endmacro %}

{% macro validate_choice(var_name, var_value, choices) %}
{% if var_value not in choices %}
  {% error var_name + " must be one of: " + choices | join(", ") %}
{% endif %}
{% endmacro %}

{% macro validate_format(var_name, var_value, pattern, description) %}
{% if not var_value | regex_match(pattern) %}
  {% error var_name + " must match format: " + description %}
{% endif %}
{% endmacro %}
```

Use validation macros in your templates:

```jinja
{# src/main.rs #}
{% include "includes/validation.jinja" %}

{# Validate required variables #}
{{ validate_required("project_name", project_name) }}
{{ validate_required("author.name", author.name) }}

{# Validate choices #}
{{ validate_choice("database_type", database_type, ["postgresql", "mysql", "sqlite"]) }}

{# Validate format #}
{{ validate_format("project_name", project_name, "^[a-z][a-z0-9_]*$", "lowercase with underscores") }}
```

### 3. Output Validation

Create comprehensive tests for generated output:

```bash
#!/bin/bash
# test_template_output.sh

set -e  # Exit on any error

echo "Starting template output validation..."

# Test different configurations
test_configs=(
    "basic:project_name=test-basic,database_type=sqlite"
    "advanced:project_name=test-advanced,database_type=postgresql,include_auth=true"
    "minimal:project_name=test-minimal,features="
)

for config in "${test_configs[@]}"; do
    IFS=':' read -r test_name params <<< "$config"
    echo "Testing configuration: $test_name"
    
    # Create test directory
    test_dir="test-output-$test_name"
    rm -rf "$test_dir"
    
    # Generate project with specific configuration
    archetect render . "$test_dir" --headless --overwrite \
        $(echo "$params" | tr ',' '\n' | sed 's/^/-a /')
    
    # Validate generated output
    validate_output "$test_dir" "$test_name"
done

echo "✓ All template output tests passed!"

validate_output() {
    local output_dir=$1
    local config_name=$2
    
    cd "$output_dir"
    
    # Check basic file structure
    check_file_exists "Cargo.toml"
    check_file_exists "src/main.rs"
    check_file_exists "README.md"
    
    # Validate Rust syntax if cargo is available
    if command -v cargo &> /dev/null; then
        echo "  Checking Rust syntax..."
        if cargo check --quiet; then
            echo "  ✓ Generated Rust code is valid"
        else
            echo "  ✗ Generated Rust code has syntax errors"
            exit 1
        fi
    fi
    
    # Validate file contents
    validate_cargo_toml
    validate_main_rs
    
    # Configuration-specific validations
    case "$config_name" in
        "advanced")
            check_file_exists "src/auth/mod.rs"
            check_database_config "postgresql"
            ;;
        "minimal")
            check_file_not_exists "src/database/"
            ;;
    esac
    
    cd ..
}

check_file_exists() {
    if [ -f "$1" ]; then
        echo "  ✓ $1 exists"
    else
        echo "  ✗ $1 missing"
        exit 1
    fi
}

check_file_not_exists() {
    if [ ! -e "$1" ]; then
        echo "  ✓ $1 correctly excluded"
    else
        echo "  ✗ $1 should not exist"
        exit 1
    fi
}

validate_cargo_toml() {
    if grep -q "^name = " Cargo.toml; then
        echo "  ✓ Cargo.toml has project name"
    else
        echo "  ✗ Cargo.toml missing project name"
        exit 1
    fi
}

validate_main_rs() {
    if grep -q "fn main" src/main.rs; then
        echo "  ✓ main.rs has main function"
    else
        echo "  ✗ main.rs missing main function"
        exit 1
    fi
}
```

## Debugging Templates

### 1. Template Debugging Techniques

Add debugging output to templates during development:

```jinja
{# Enable debug mode via variable #}
{% set debug = debug | default(false) %}

{% if debug %}
{# 
=== DEBUG INFORMATION ===
Template: {{ __template_name__ }}
Variables:
{% for key, value in __context__ %}
- {{ key }}: {{ value }}
{% endfor %}
=== END DEBUG ===
#}
{% endif %}

// Generated code starts here
use std::collections::HashMap;

{% if debug %}
// Debug: Processing {{ features | length }} features
{% endif %}

{% for feature in features %}
{% if debug %}
// Debug: Processing feature {{ loop.index }}/{{ features | length }}: {{ feature }}
{% endif %}
pub mod {{ feature | snake_case }};
{% endfor %}
```

### 2. Progressive Template Testing

Test templates incrementally during development:

```jinja
{# src/lib.rs.debug #}
{# Start with minimal template #}
//! {{ project_name }} library

{% if step >= 1 %}
// Step 1: Basic exports
pub mod config;
{% endif %}

{% if step >= 2 %}
// Step 2: Add database support
{% if include_database %}
pub mod database;
{% endif %}
{% endif %}

{% if step >= 3 %}
// Step 3: Add features
{% for feature in features %}
pub mod {{ feature | snake_case }};
{% endfor %}
{% endif %}
```

Test with different step values:

```bash
# Test step by step
archetect render . test-step1 -a step=1
archetect render . test-step2 -a step=2
archetect render . test-step3 -a step=3
```

### 3. Error Handling and Recovery

Implement graceful error handling in templates:

```jinja
{# src/config.rs #}
{% try %}
use {{ external_crate }}::Config;
{% catch %}
{# Fallback if external_crate is not available #}
use std::collections::HashMap as Config;
{% endtry %}

{% if database_type is defined %}
    {% if database_type in ["postgresql", "mysql", "sqlite"] %}
use {{ database_type }}_driver as db;
    {% else %}
        {% error "Invalid database_type: " + database_type + ". Must be postgresql, mysql, or sqlite." %}
    {% endif %}
{% else %}
// No database configuration - using in-memory storage
{% endif %}
```

## Testing Frameworks and Tools

### 1. Automated Testing Pipeline

Create a comprehensive testing pipeline:

```yaml
# .github/workflows/test-templates.yml
name: Test Templates

on: [push, pull_request]

jobs:
  test-templates:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        config:
          - name: "minimal"
            args: "project_name=test-minimal"
          - name: "full-featured"
            args: "project_name=test-full,database_type=postgresql,include_auth=true,include_api=true"
          - name: "custom"
            args: "project_name=test-custom,framework=axum,database_type=sqlite"
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Archetect
        run: |
          curl -sSL https://github.com/archetect/archetect/releases/latest/download/archetect-linux-x64 -o archetect
          chmod +x archetect
          sudo mv archetect /usr/local/bin/
      
      - name: Generate project
        run: |
          archetect render . test-output-${{ matrix.config.name }} --headless \
            $(echo "${{ matrix.config.args }}" | tr ',' '\n' | sed 's/^/-a /')
      
      - name: Validate generated project
        run: |
          cd test-output-${{ matrix.config.name }}
          
          # Check basic structure
          test -f Cargo.toml
          test -f src/main.rs
          test -f README.md
          
          # Install Rust if needed and validate syntax
          curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
          source ~/.cargo/env
          cargo check
      
      - name: Run integration tests
        run: |
          cd test-output-${{ matrix.config.name }}
          if [ -f "tests/" ]; then
            cargo test
          fi
```

### 2. Template Linting

Create custom linting rules for templates:

```python
#!/usr/bin/env python3
# lint_templates.py

import re
import sys
from pathlib import Path
from typing import List, Tuple

class TemplateLinter:
    def __init__(self):
        self.errors = []
        
    def lint_file(self, file_path: Path) -> List[str]:
        """Lint a single template file."""
        errors = []
        
        try:
            content = file_path.read_text(encoding='utf-8')
        except UnicodeDecodeError:
            # Skip binary files
            return errors
            
        lines = content.split('\n')
        
        for line_num, line in enumerate(lines, 1):
            errors.extend(self._check_line(file_path, line_num, line))
            
        return errors
    
    def _check_line(self, file_path: Path, line_num: int, line: str) -> List[str]:
        """Check a single line for issues."""
        errors = []
        
        # Check for unclosed template tags
        if '{{' in line and '}}' not in line:
            errors.append(f"{file_path}:{line_num}: Unclosed variable tag")
        
        if '{%' in line and '%}' not in line:
            errors.append(f"{file_path}:{line_num}: Unclosed template tag")
            
        # Check for deprecated patterns
        if re.search(r'\{\{\s*[^}]+\s*\|\s*safe\s*\}\}', line):
            errors.append(f"{file_path}:{line_num}: Avoid 'safe' filter - ensure input is trusted")
        
        # Check for common mistakes
        if re.search(r'\{\{\s*[^}]+\s*==\s*[^}]+\s*\}\}', line):
            errors.append(f"{file_path}:{line_num}: Use {% if %} instead of {{ }} for conditionals")
            
        # Check for proper variable naming
        var_matches = re.findall(r'\{\{\s*([a-zA-Z_][a-zA-Z0-9_\.]*)\s*(?:\|[^}]*)?\}\}', line)
        for var in var_matches:
            if var.startswith('_'):
                errors.append(f"{file_path}:{line_num}: Variable '{var}' should not start with underscore")
                
        return errors
    
    def lint_directory(self, template_dir: Path) -> int:
        """Lint all template files in directory."""
        total_errors = 0
        
        for template_file in template_dir.rglob("*"):
            if template_file.is_file() and not self._should_skip_file(template_file):
                errors = self.lint_file(template_file)
                if errors:
                    print(f"\nErrors in {template_file}:")
                    for error in errors:
                        print(f"  {error}")
                    total_errors += len(errors)
        
        return total_errors
    
    def _should_skip_file(self, file_path: Path) -> bool:
        """Check if file should be skipped during linting."""
        skip_patterns = [
            '*.png', '*.jpg', '*.jpeg', '*.gif', '*.ico',
            '*.zip', '*.tar', '*.gz', '*.bz2',
            '.git/*', 'node_modules/*', 'target/*'
        ]
        
        for pattern in skip_patterns:
            if file_path.match(pattern):
                return True
        
        return False

def main():
    linter = TemplateLinter()
    template_dir = Path("content")
    
    if not template_dir.exists():
        print("Template directory 'content' not found")
        sys.exit(1)
    
    total_errors = linter.lint_directory(template_dir)
    
    if total_errors == 0:
        print("✓ All templates passed linting")
        sys.exit(0)
    else:
        print(f"\n✗ Found {total_errors} errors")
        sys.exit(1)

if __name__ == "__main__":
    main()
```

### 3. Performance Testing

Test template rendering performance:

```python
#!/usr/bin/env python3
# perf_test_templates.py

import time
import subprocess
import statistics
from pathlib import Path

def benchmark_rendering(iterations=5):
    """Benchmark template rendering performance."""
    times = []
    
    for i in range(iterations):
        start_time = time.time()
        
        # Run archetype generation
        result = subprocess.run([
            'archetect', 'render', '.', f'perf-test-{i}',
            '--headless', '--overwrite',
            '-a', 'project_name=perf-test',
            '-a', 'database_type=postgresql',
            '-a', 'include_auth=true'
        ], capture_output=True, text=True)
        
        end_time = time.time()
        
        if result.returncode != 0:
            print(f"Error in iteration {i}: {result.stderr}")
            continue
            
        elapsed = end_time - start_time
        times.append(elapsed)
        
        # Cleanup
        subprocess.run(['rm', '-rf', f'perf-test-{i}'], capture_output=True)
    
    if times:
        avg_time = statistics.mean(times)
        min_time = min(times)
        max_time = max(times)
        
        print(f"Template rendering performance:")
        print(f"  Average: {avg_time:.2f}s")
        print(f"  Min:     {min_time:.2f}s")
        print(f"  Max:     {max_time:.2f}s")
        
        if avg_time > 5.0:
            print("⚠️  Template rendering is slow (>5s average)")
        else:
            print("✓ Template rendering performance is good")
    else:
        print("❌ No successful iterations")

if __name__ == "__main__":
    benchmark_rendering()
```

This comprehensive testing and validation approach ensures your templates are reliable, maintainable, and produce correct output across different configurations and use cases.