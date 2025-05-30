---
sidebar_position: 5
---

# Common Workflows

This guide covers essential workflows and patterns for using Archetect effectively in your daily development practice. From quick prototyping to enterprise development, these workflows will help you work efficiently and consistently.

## Quick Prototyping Workflow

### Rapid Project Generation

When you need to quickly test an idea or create a prototype:

```bash
# 1. Quick generation with minimal setup
# Creates a directory named 'prototype-app' containing the entire project
archetect render rust-cli prototype-app \
  -a project_name="prototype-app" \
  -a description="Quick prototype for testing idea" \
  -a author_name="$(git config user.name)"

# 2. Skip optional features for speed
archetect render web-app prototype \
  -s minimal \
  --headless \
  -A quick-prototype.yaml
```

**Answer file for prototyping:**
```yaml
# quick-prototype.yaml
project_name: "{{ env.PROJECT_NAME | default('prototype') }}"
description: "Quick prototype"
author_name: "{{ env.USER }}"
features: ["basic"]  # Minimal feature set
testing: false
documentation: false
deployment: false
```

### Prototype Iteration

Refine your prototype quickly:

```bash
# Generate variations - each creates its own project directory
archetect render web-app prototype-v2 \
  -A quick-prototype.yaml \
  -a project_name="prototype-v2" \
  -s advanced-features

# Compare approaches - creates 'prototype-rest' and 'prototype-graphql' directories
archetect render api-server prototype-rest -A api-config.yaml
archetect render graphql-api prototype-graphql -A api-config.yaml
```

## Development Team Workflow

### Standardized Project Creation

Ensure consistency across team projects:

```bash
# 1. Use team-standard archetype
# Creates 'user-service/' directory with complete microservice structure
archetect render company/microservice user-service \
  -A team-configs/microservice-defaults.yaml

# 2. Apply team conventions
# Creates 'dashboard/' directory with frontend application
archetect render company/frontend dashboard \
  -A team-configs/frontend-standards.yaml \
  -s testing \
  -s storybook
```

**Team configuration files:**
```yaml
# team-configs/microservice-defaults.yaml
author_organization: "Your Company"
license: "Proprietary"
database_type: "postgresql"
auth_provider: "auth0"
deployment_target: "kubernetes"
monitoring: true
logging: "structured"
testing: "comprehensive"

# Common features for all microservices
features:
  - "database"
  - "auth"
  - "monitoring"
  - "health-checks"
  - "metrics"
```

### Code Review Integration

Include archetype information in code reviews:

```bash
# Generate with documentation
archetect render microservice review-service \
  -A team-configs/microservice-defaults.yaml \
  -s documentation \
  > generation-log.txt

# Include generation details in PR
echo "Generated with: company/microservice archetype v2.1.0" >> PR-template.md
echo "Configuration: team-configs/microservice-defaults.yaml" >> PR-template.md
```

## CI/CD Integration Workflow

### Automated Project Generation

Integrate Archetect into your CI/CD pipelines:

```yaml
# .github/workflows/new-service.yml
name: Generate New Service
on:
  workflow_dispatch:
    inputs:
      service_name:
        description: 'Service name'
        required: true
      database_type:
        description: 'Database type'
        required: true
        default: 'postgresql'
        type: choice
        options:
        - postgresql
        - mysql
        - mongodb

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Install Archetect
        run: |
          curl -L https://github.com/archetect/archetect/releases/latest/download/archetect-linux-x86_64.tar.gz | tar xz
          sudo mv archetect /usr/local/bin/
      
      - name: Generate Service
        run: |
          archetect render company/microservice "${{ github.event.inputs.service_name }}" \
            --headless \
            -a service_name="${{ github.event.inputs.service_name }}" \
            -a database_type="${{ github.event.inputs.database_type }}" \
            -A .github/configs/service-defaults.yaml
      
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: "feat: add ${{ github.event.inputs.service_name }} service"
          title: "New service: ${{ github.event.inputs.service_name }}"
          body: |
            Generated new microservice using company archetype.
            The service was created in its own directory: ${{ github.event.inputs.service_name }}/
            
            **Configuration:**
            - Service: ${{ github.event.inputs.service_name }}
            - Database: ${{ github.event.inputs.database_type }}
            - Archetype: company/microservice
```

### Infrastructure as Code

Generate infrastructure alongside application code:

```bash
# Generate application and infrastructure together
archetect render fullstack-app my-app \
  -s kubernetes \
  -s terraform \
  -A production-config.yaml

# Or separate steps
archetect render app-code my-app -A app-config.yaml
archetect render infrastructure my-app-infra \
  -a app_name="my-app" \
  -A infra-config.yaml
```

## Multi-Service Architecture Workflow

### Microservices Generation

Create multiple related services efficiently:

```bash
#!/bin/bash
# generate-microservices.sh

services=(
  "user-service:users"
  "order-service:orders" 
  "payment-service:payments"
  "notification-service:notifications"
)

base_config="configs/microservice-base.yaml"

for service_def in "${services[@]}"; do
  IFS=':' read -r service_name domain <<< "$service_def"
  
  echo "Generating $service_name..."
  
  archetect render company/microservice "$service_name" \
    --headless \
    -A "$base_config" \
    -a service_name="$service_name" \
    -a domain="$domain" \
    -a port="$((8000 + ${#service_name}))"
  
  # Generate database migrations
  if [ -d "$service_name/migrations" ]; then
    echo "Setting up database for $service_name..."
    cd "$service_name"
    # Run database setup commands
    cd ..
  fi
done

echo "All services generated successfully!"
```

### Service Mesh Integration

Generate services configured for service mesh:

```bash
# Generate with Istio configuration
archetect render microservice-istio user-service \
  -s istio \
  -s tracing \
  -s security \
  -A service-mesh-config.yaml
```

## Frontend Development Workflow

### Component Library Development

Create and maintain component libraries:

```bash
# Generate component library
archetect render component-library ui-components \
  -s storybook \
  -s testing \
  -s documentation

# Generate individual components
cd ui-components
archetect render component Button \
  -a component_name="Button" \
  -a component_type="interactive" \
  -s variants \
  -s accessibility
```

### Multi-Framework Support

Generate for different frontend frameworks:

```bash
# React version
archetect render react-app web-app-react \
  -A frontend-config.yaml

# Vue version  
archetect render vue-app web-app-vue \
  -A frontend-config.yaml \
  -a framework="vue"

# Angular version
archetect render angular-app web-app-angular \
  -A frontend-config.yaml \
  -a framework="angular"
```

## Database Development Workflow

### Schema-Driven Development

Generate application code from database schema:

```bash
# 1. Define schema
cat > schema.yaml << EOF
tables:
  users:
    fields:
      - {name: id, type: uuid, primary_key: true}
      - {name: email, type: string, unique: true}
      - {name: name, type: string}
  posts:
    fields:
      - {name: id, type: uuid, primary_key: true}
      - {name: title, type: string}
      - {name: content, type: text}
      - {name: user_id, type: uuid, foreign_key: users.id}
EOF

# 2. Generate application with schema
archetect render schema-driven-app blog-app \
  -a schema_file="schema.yaml" \
  -s migrations \
  -s api \
  -s admin-interface
```

### Multi-Database Support

Generate for different database backends:

```bash
# PostgreSQL version
archetect render data-app app-postgres \
  -a database_type="postgresql" \
  -s advanced-queries

# MongoDB version
archetect render data-app app-mongo \
  -a database_type="mongodb" \
  -s aggregation-pipelines

# Multi-database version
archetect render data-app app-multi \
  -s multi-database \
  -a primary_db="postgresql" \
  -a cache_db="redis"
```

## Testing and Quality Assurance

### Test-Driven Development

Generate projects with comprehensive testing:

```bash
# Generate with full testing suite
archetect render tdd-project my-app \
  -s unit-tests \
  -s integration-tests \
  -s e2e-tests \
  -s performance-tests \
  -A testing-config.yaml
```

### Quality Gates

Ensure generated code meets quality standards:

```bash
# Generate with quality tools
archetect render high-quality-app my-app \
  -s linting \
  -s formatting \
  -s security-scanning \
  -s coverage-reporting \
  -a quality_level="strict"

# Validate generated code
cd my-app
npm run lint
npm run test:coverage
npm run security:audit
```

## Documentation Workflow

### Documentation-First Development

Generate projects with comprehensive documentation:

```bash
# Generate with full documentation
archetect render documented-project my-project \
  -s api-docs \
  -s user-guides \
  -s developer-docs \
  -s deployment-guides

# Generate documentation site
archetect render docs-site my-project-docs \
  -a source_project="../my-project" \
  -s interactive-examples
```

### API Documentation

Generate API projects with built-in documentation:

```bash
# REST API with OpenAPI
archetect render rest-api my-api \
  -s openapi \
  -s swagger-ui \
  -s postman-collection

# GraphQL API with documentation
archetect render graphql-api my-graphql \
  -s graphql-playground \
  -s schema-documentation \
  -s resolver-docs
```

## Deployment and Operations

### Cloud-Native Applications

Generate cloud-ready applications:

```bash
# AWS deployment
archetect render cloud-app my-app \
  -s aws \
  -s lambda \
  -s dynamodb \
  -A aws-config.yaml

# Kubernetes deployment
archetect render k8s-app my-app \
  -s kubernetes \
  -s helm \
  -s monitoring \
  -A k8s-config.yaml

# Multi-cloud
archetect render multi-cloud-app my-app \
  -s aws \
  -s azure \
  -s gcp \
  -A multi-cloud-config.yaml
```

### GitOps Workflow

Generate with GitOps configuration:

```bash
# Generate application with GitOps
archetect render gitops-app my-app \
  -s argocd \
  -s flux \
  -s kustomize \
  -A gitops-config.yaml
```

## Mobile Development Workflow

### Cross-Platform Development

Generate mobile apps for multiple platforms:

```bash
# React Native
archetect render mobile-app my-app-rn \
  -a platform="react-native" \
  -s ios \
  -s android \
  -s navigation

# Flutter
archetect render mobile-app my-app-flutter \
  -a platform="flutter" \
  -s ios \
  -s android \
  -s state-management
```

## Performance Optimization

### High-Performance Applications

Generate performance-optimized applications:

```bash
# Generate with performance features
archetect render high-perf-app my-app \
  -s caching \
  -s compression \
  -s cdn \
  -s monitoring \
  -a performance_target="high"
```

## Best Practices for Workflows

### Workflow Documentation

Document your team's workflows:

```markdown
# Team Workflow: Microservice Creation

1. **Planning Phase**
   - Define service requirements
   - Choose appropriate archetype
   - Prepare configuration files

2. **Generation Phase**
   ```bash
   archetect render company/microservice $SERVICE_NAME \
     -A team-configs/microservice-defaults.yaml \
     -a service_name="$SERVICE_NAME"
   ```

3. **Validation Phase**
   - Run generated tests
   - Validate configuration
   - Review security settings

4. **Integration Phase**
   - Add to service registry
   - Configure monitoring
   - Update documentation
```

### Automation Scripts

Create reusable scripts for common workflows:

```bash
#!/bin/bash
# new-feature.sh - Generate feature branch with boilerplate

feature_name=$1
base_archetype=$2

if [ -z "$feature_name" ]; then
  echo "Usage: $0 <feature-name> [archetype]"
  exit 1
fi

# Create feature branch
git checkout -b "feature/$feature_name"

# Generate feature code
archetect render "${base_archetype:-feature-template}" "$feature_name" \
  -A .archetect/feature-defaults.yaml \
  -a feature_name="$feature_name"

# Stage generated files
git add .
git commit -m "feat: add $feature_name boilerplate"

echo "Feature branch 'feature/$feature_name' created with boilerplate"
```

These workflows provide proven patterns for integrating Archetect into various development scenarios, from individual prototyping to enterprise-scale development processes.