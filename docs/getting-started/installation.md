---
sidebar_position: 2
---

# Installation

This guide will help you install Archetect on your system using various methods.

## System Requirements

- **Operating System**: Linux, macOS, or Windows
- **Architecture**: x86_64 or ARM64
- **Disk Space**: ~50MB for the binary and dependencies
- **Git**: Required for working with remote archetypes

## Installation Methods

### Pre-built Binaries (Recommended)

Download the latest release from [GitHub Releases](https://github.com/archetect/archetect/releases):

#### Linux
```bash
# Download and install to /usr/local/bin
curl -L https://github.com/archetect/archetect/releases/latest/download/archetect-linux-x86_64.tar.gz | sudo tar xz -C /usr/local/bin
```

#### macOS
```bash
# Download and install to /usr/local/bin
curl -L https://github.com/archetect/archetect/releases/latest/download/archetect-macos-x86_64.tar.gz | sudo tar xz -C /usr/local/bin

# For Apple Silicon Macs
curl -L https://github.com/archetect/archetect/releases/latest/download/archetect-macos-arm64.tar.gz | sudo tar xz -C /usr/local/bin
```

#### Windows
1. Download `archetect-windows-x86_64.zip` from the releases page
2. Extract to a directory in your PATH (e.g., `C:\Program Files\Archetect\`)
3. Add the directory to your system PATH

### Package Managers

#### Homebrew (macOS/Linux)
```bash
brew install archetect
```

#### Cargo (Rust)
```bash
cargo install archetect
```

#### Arch Linux (AUR)
```bash
yay -S archetect
```

### Building from Source

If you have Rust installed, you can build from source:

```bash
# Clone the repository
git clone https://github.com/archetect/archetect.git
cd archetect

# Build and install
cargo install --path .
```

## Verification

Verify your installation by running:

```bash
archetect --version
```

You should see output similar to:
```
archetect 2.0.0
```

## Shell Completions

Archetect can generate shell completions for better command-line experience:

### Bash
```bash
archetect completions bash > ~/.local/share/bash-completion/completions/archetect
```

### Zsh
```bash
archetect completions zsh > ~/.zfunc/_archetect
# Add ~/.zfunc to your $fpath in ~/.zshrc
```

### Fish
```bash
archetect completions fish > ~/.config/fish/completions/archetect.fish
```

### PowerShell
```powershell
archetect completions powershell > $PROFILE
```

## Configuration

Archetect will create a configuration directory at:
- **Linux/macOS**: `~/.archetect/`
- **Windows**: `%APPDATA%\archetect\`

This directory contains:
- `config.yaml` - User configuration and preferences
- `cache/` - Cached Git repositories and resources

## Next Steps

Now that Archetect is installed, let's explore [basic concepts](./concepts) to understand how it works, or jump straight to the [quick start tutorial](./quick-start) to generate your first project.

## Troubleshooting

### Permission Denied
If you get permission errors during installation:
- Ensure you have write access to the installation directory
- Use `sudo` for system-wide installation on Unix systems
- On macOS, you may need to allow the binary in System Preferences > Security & Privacy

### Command Not Found
If `archetect` command is not found:
- Verify the binary is in your PATH
- Restart your terminal session
- Check the installation directory matches your system's PATH

### macOS Quarantine
On macOS, you may need to remove the quarantine attribute:
```bash
sudo xattr -r -d com.apple.quarantine /usr/local/bin/archetect
```