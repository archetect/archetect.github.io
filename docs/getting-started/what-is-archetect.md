---
sidebar_position: 1
---

# What is Archetect?

Archetect is a **code-centric, language-agnostic content generator**. Point it at an *archetype* — a templated blueprint hosted in a git repository or local directory — answer a few prompts, and it renders anything from a single file to a complete, ready-to-build project.

```shell
archetect render https://github.com/your-org/rust-grpc-service.git my-service
```

## Why it exists

Every team eventually accumulates a "way we do things": project layout, build configuration, CI pipelines, lint rules, logging conventions, license headers. The usual ways of propagating that knowledge all have problems:

- **Copy-paste from the last project** drags along stale dependencies, leftover business logic, and yesterday's mistakes.
- **Static template repositories** ("click *Use this template* on GitHub") can't adapt — every placeholder still has to be found and renamed by hand, and there is exactly one variant.
- **Wiki checklists** rot the moment they're written.

Archetect treats project generation as a first-class, programmable activity:

- **Prompts capture intent.** An archetype asks for what it needs — a project name, a database flavor, which features to include — with sensible defaults and validation.
- **Scripts make decisions.** A Lua script orchestrates the render: conditionally including files, deriving values, composing other archetypes, even initializing a git repository.
- **Templates do the typing.** Every file in the archetype is a template. Type a name once, and casing filters spread it correctly across file names, struct names, package declarations, and configuration.
- **Git is the distribution system.** Archetypes and catalogs are plain git repositories. Publishing an update is a `git push`; consumers get it on their next render.

## What makes Archetect different

**It's fast.** Archetect is a single native binary written in Rust. Rendering even a large multi-module project is effectively instantaneous — fast enough to regenerate scaffolding as part of tight feedback loops.

**It's language-agnostic.** Archetect doesn't know or care what it's generating: Rust, Java, TypeScript, Terraform, documentation, dotfiles. If it's text, Archetect can template it.

**It scales from files to architectures.** A single archetype can render one `.gitignore` file. A catalog of composed archetypes can scaffold an entire microservice architecture — services, frontends, infrastructure — with shared prompts and conventions across all of them.

**It's built for both humans and machines.** The same archetype that prompts a developer interactively can run fully headless in CI with answers supplied from files or flags — and can even be driven by AI agents through Archetect's MCP server.

## When to use it

Reach for Archetect when:

- You create the same *kind* of thing repeatedly — services, libraries, components, modules.
- You want new projects to start from your organization's current best practices, not a snapshot of them.
- You need consistent naming and structure derived from a few inputs.
- You want one blueprint to serve many variations (with prompts, switches, and composition) instead of maintaining a fleet of diverging template repos.

## Next step

[Install Archetect](./installation) and generate your first project.
