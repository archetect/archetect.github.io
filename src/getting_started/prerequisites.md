# Prerequisites

## Git

Archetect is a single native binary designed for use on the command line.  Technically, placing this is on your shell's path is all you would need to get going.  You could limit yourself to generating projects from archetypes authored or downloaded on your local machine.  But that's no fun.

Archetect was designed to work with git, and you'll want to have git set up on your machine to unleash it's full power.  Furthermore, to get the best experience, you'll also want to set up SSH password-less authentication on any git hosts you might expect to pull archetypes from.

Setting up git is beyond the scope of this book.  There are many resources available online for your specific platform.  GitHub's own [documentation on the subject](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/connecting-to-github-with-ssh) is a good place to start.

If you are able to execute the following command from your shell's command line in a directory you like storing coding projects, without being prompted for a password, you should be ready to go:

```shell script
git clone git@github.com:archetect/archetect.git
```

## A Note on Windows

Archetect works best with a Unix-like shell, and should work flawlessly on OSX and Linux.  While Archetect works on Windows under PowerShell, you'll get the best experience by leveraging the "Git Bash Shell" that typically comes with a Windows Git install, and found within your Start Menu.
