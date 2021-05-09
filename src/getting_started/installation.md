# Installation

## Pre-compiled binaries

Pre-compiled binaries are available on Archetect's [Releases GitHub Page](https://github.com/archetect/archetect/releases/latest) for 64 bit flavors of OSX, Linux, and Windows.  The Linux binary is compiled against [musl libc](https://musl.libc.org/) for compatibility on multiple Linux distribution flavors.

Installation is as simple as downloading the zip file that matches your platform, extracting the contents, and placing the `archetect` or `archetect.exe` binary within a location of your choosing.  Ideally, that location would be on your path.

Note: On OSX, unsigned cli binaries, like Archetect, are not allowed to run by default. To allow Archetect to run on
OSX, you'll need to browse to the binary with Finder, right or Control-click on it, and click "Open".  Once you've done this, you
should be able to execute Archetect at the command line for hence forth.

## For Rust Developers

If you're an existing or aspiring Rust developer with a recent version of the [Rust toolchain](https://rustup.rs/) installed, 
you can install Archetect in a few ways.

Via cargo (for the most recent stable version):

```shell
cargo install archetect --force
```

From source (for the bleeding edge):

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