# Installation

## Pre-compiled binaries

Pre-compiled binaries are available on Archetect's [Releases GitHub Page](https://github.com/archetect/archetect/releases/latest) for 64 bit flavors of OSX, Linux, and Windows.  The Linux binary is compiled against [musl libc](https://musl.libc.org/) for compatibility on multiple Linux distribution flavors.

Installation is as simple as downloading the zip file that matches your platform, extracting the contents, and placing the `archetect` or `archetect.exe` binary within a location of your choosing.  Ideally, that location would be on your path.

## Compile from Source

If you're an existing or aspiring Rust developer, using a recent installation of the [Rust toolchain](https://rustup.rs/), you can install Archetect from source:

```shell script
cd ~/projects/rust
git clone git@github.com:archetect/archetect.git
cd archetect
cargo install --path ./archetect-cli --force 
```

## Verifying Install

If Archetect is on your shell's path, you can verify that you've got a working binary by executing the following from your shell:

```shell script
archetect --version
``` 