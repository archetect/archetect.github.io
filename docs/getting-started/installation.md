---
sidebar_position: 2
---

# Installation

Archetect ships as a single native binary for macOS, Linux, and Windows.

## Homebrew (macOS and Linux)

```shell
brew install archetect/tap/archetect
```

Upgrades arrive through the normal Homebrew flow:

```shell
brew upgrade archetect
```

## Pre-built binaries

Download the archive for your platform from the [GitHub Releases page](https://github.com/archetect/archetect/releases/latest), extract it, and place the `archetect` binary somewhere on your `PATH`.

## From source

With a [Rust toolchain](https://rustup.rs/) installed:

```shell
git clone https://github.com/archetect/archetect.git
cd archetect
cargo install --path archetect-bin
```

## Verify the installation

```shell
archetect --version
```

```text
archetect 3.0.0
```

Then let Archetect inspect its own environment:

```shell
archetect check
```

```text
🔍 Git installation (optional)
	🟢 git version 2.54.0

🔍 Git user.name and user.email
	🟢 Jane Developer <jane@example.com>

🔍 Cache directory
	🟢 /home/jane/.cache/archetect (writable)

🔍 Shell execution policy
	ℹ  Prompt — scripts must request approval per command (default)

🔍 Lua IDE annotations
	ℹ  Not installed
	   Run `archetect ide setup` to install Lua type annotations for IDE autocomplete.

🔍 GITHUB_TOKEN environment variable
	ℹ  Not set
	   Required only if archetype scripts use the archetect.github module.
```

Green checks are required for a healthy setup; informational items only matter for specific workflows (the notes tell you which).

## Shell completions

Archetect can generate completions for `bash`, `zsh`, `fish`, `powershell`, and `elvish`:

```shell
# zsh example
archetect completions zsh > ~/.zfunc/_archetect
```

Consult your shell's documentation for where completion scripts belong.

## Where Archetect keeps its files

Archetect follows the XDG base directory conventions:

```shell
archetect system layout
```

```text
Etc Directory:   ~/.config/archetect
Etc.d Directory: ~/.config/archetect/etc.d
Cache Directory: ~/.cache/archetect
Data Directory:  ~/.local/share/archetect
```

- **Config** (`~/.config/archetect/`) — your `archetect.yaml` configuration.
- **Cache** (`~/.cache/archetect/`) — cloned archetypes and catalogs.
- **Data** (`~/.local/share/archetect/`) — installed support files, such as Lua IDE annotations.

## Next step

Learn the [core concepts](./core-concepts), or jump straight to the [Quick Start](./quick-start).
