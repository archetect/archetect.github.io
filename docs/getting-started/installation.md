---
sidebar_position: 2
---

# Installation

Archetect can be installed using several methods depending on your operating system and preferences.

## Binary Downloads

The easiest way to install Archetect is by downloading pre-built binaries from the GitHub releases page.

### Requirements
- [Git](https://git-scm.com/) for accessing archetypes
- Git credentials configured if accessing private archetypes
- Works on Windows, macOS, and Linux

### Installation Steps
1. Visit [https://github.com/archetect/archetect/releases/latest](https://github.com/archetect/archetect/releases/latest)
2. Download the appropriate binary for your operating system:
   - **Windows**: `archetect-x86_64-pc-windows-msvc.exe`
   - **macOS**: `archetect-x86_64-apple-darwin` or `archetect-aarch64-apple-darwin` (for Apple Silicon)
   - **Linux**: `archetect-x86_64-unknown-linux-gnu` or `archetect-x86_64-unknown-linux-musl`
3. Extract the binary and place it in your system's PATH
4. Verify installation by running `archetect --version`

## Homebrew (macOS and Linux)

For macOS and Linux users, Archetect can be installed via Homebrew using the official tap.

### Requirements
- [Homebrew](https://brew.sh/) package manager installed
- [Git](https://git-scm.com/) for accessing archetypes
- Git credentials configured if accessing private archetypes
- macOS or Linux operating system

### Installation Steps
```bash
# Add the Archetect tap
brew tap archetect/tap

# Install Archetect
brew install archetect
```

### Updating
```bash
brew update
brew upgrade archetect
```

## Building from Source

For developers or users who want the latest features, Archetect can be built from source.

### Requirements
- [Rust](https://rustup.rs/) toolchain (latest stable version)
- [Git](https://git-scm.com/) for cloning the repository
- C compiler (for some dependencies)
  - **Windows**: Visual Studio Build Tools or MSVC
  - **macOS**: Xcode Command Line Tools (`xcode-select --install`)
  - **Linux**: GCC or Clang (`build-essential` package on Debian/Ubuntu)

### Installation Steps
```bash
# Clone the repository
git clone https://github.com/archetect/archetect.git
cd archetect

# Build and install using the custom task runner
cargo xtask install
```

This will build Archetect in release mode and install it to your Cargo bin directory (typically `~/.cargo/bin`).

## Verification

After installation, verify that Archetect is properly installed:

```bash
archetect --version
```

You should see output similar to:
```
archetect x.x.x
```

## Troubleshooting

### PATH Issues
If you get a "command not found" error after installation:

- **Binary installation**: Ensure the binary is in a directory listed in your PATH environment variable
- **Homebrew**: Usually handles PATH automatically, but you may need to restart your terminal
- **Cargo installation**: Ensure `~/.cargo/bin` is in your PATH

### Permission Issues
If you encounter permission errors:

- **macOS**: You may need to allow the binary in System Preferences > Security & Privacy
- **Linux**: Ensure the binary has execute permissions (`chmod +x archetect`)

## Next Steps

Once installed, continue to the [Quick Start](./quick-start) guide to learn how to use Archetect.
