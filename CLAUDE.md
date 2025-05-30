# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Install dependencies**: `pnpm install`
- **Start development server**: `pnpm start` (opens browser with live reload)
- **Build for production**: `pnpm build` (outputs to `build/` directory)
- **Type checking**: `pnpm typecheck`
- **Serve built site locally**: `pnpm serve`
- **Clear cache**: `pnpm clear`

## Architecture

This is a Docusaurus v3 static site generator project for the Archetect documentation website. Key architectural components:

- **Site Configuration**: `docusaurus.config.ts` - Main configuration including site metadata, navigation, deployment settings, and theme configuration
- **Sidebar Configuration**: `sidebars.ts` - Controls documentation navigation structure (currently auto-generated from folder structure)
- **Content Structure**:
  - `docs/` - Documentation pages with auto-generated sidebar
  - `blog/` - Blog posts with RSS/Atom feeds
  - `src/pages/` - Custom React pages
  - `src/components/` - Reusable React components
  - `static/` - Static assets (images, favicon, etc.)

## Key Configuration

- **Site URL**: https://archetect.github.io
- **GitHub Pages deployment**: Configured for `archetect` organization
- **Edit links**: Point to GitHub repository for collaborative editing
- **Theme**: Uses custom CSS in `src/css/custom.css` with Prism syntax highlighting
- **TypeScript**: Full TypeScript support with type checking available

## Documentation Guidelines

- All doc pages will use front matter for sidebar labels and position
- All persistent plans will be stored at the root of the project in TODO.md with checkboxes placed for completed work
- When asked to resume work, check in the root of the project for unchecked items in TODO.md
- Experiments and Troubleshooting tools/scripts should be in a python file at the root of the project called test_harness.py
- Use jj for making commits
- Make commits after each chunk of work
- Ensure `pnpm build` works correctly before making commits
- For linking between documentation pages, use relative paths without file extensions and no slash appended
- When linking to directories that contain index.md files, you can reference just the directory
- For linking to blog posts or other pages outside the docs section, use Docusaurus's internal linking syntax
- For images and other assets, use relative paths from the current file
- Cross-references with automatic title resolution:
  `[](./getting-started)`
- Anchor links work naturally:
  `[Specific Section](./advanced-config#environment-variables)`
- Every documentation directory must have an index.md file
- _catalog_.json files should only contain the label and position, and nothing else.

## Mission Guide lines

- This site is documentation for the Archetect code generator.
- The code base is available at the root of this project in a symlink called "archetect".
- Do NOT make changes to content contained within the "archetect" link.
- Archetect has many systems. Each system should be documented thoroughly, in an organized professional manner.
- Use https://rhai.rs/book/ when comparing how code is used in archetect in conjunction with the documentation in this site
- Make liberal use of example archetetypes to see how the features in the code are used:
  - https://github.com/archetect-rust
  - https://github.com/archetect-common
  - https://github.com/p6m-archetypes/
- Only use catalog repositories ending in .catalog as examples of archetypes
- Archetect treats all files as templates, regardless of their extension