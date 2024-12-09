# Installation

## Homebrew

On MacOS (arm64) and on Linux (x64), Archetect can be installed with Homebrew:

```shell
brew tap archetect/archetect
brew install archetect
```

## Windows Installer

There is a Windows Installer on Archetect's [Releases GitHub Page](https://github.com/archetect/archetect/releases/latest) that:
- Enables Windows Long Path Names
- Enables Git Long Path Names
- Installs Archetect
- Add Archetect to the PATH

## Pre-compiled binaries

Pre-compiled binaries are available on Archetect's [Releases GitHub Page](https://github.com/archetect/archetect/releases/latest) for 64 bit flavors of OSX, Linux, and Windows.  

Installation is as simple as downloading the zip file that matches your platform, extracting the contents, and placing the `archetect` or `archetect.exe` binary within a location of your choosing.  Ideally, that location would be on your path.

Note: On MacOS, unsigned cli binaries like Archetect are not allowed to run by default. To allow Archetect to run on MacOS, you'll need to browse to the binary with Finder, right or Control-click on it, and click "Open".  Alternatively, you can remove the `com.apple.quarantine` flag using `xattr`:

```shell
xattr -d com.apple.quarantine <path to archetect>
```

## For Rust Developers

If you're an existing or aspiring Rust developer with a recent version of the [Rust toolchain](https://rustup.rs/) installed, you can install Archetect from source:

```shell 
cd ~/projects/rust
git clone git@github.com:archetect/archetect.git
cd archetect
cargo install --path ./archetect-bin --force 
```

## Verifying Install

Be sure to verify your installation with [Post Setup](post.md).