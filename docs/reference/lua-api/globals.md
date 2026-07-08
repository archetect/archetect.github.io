---
sidebar_position: 2
---

# Globals

Beyond [Context](context), every script has access to a small set of introspection globals and enum constants. None of them require `require()`.

## `archetect`

The `archetect` global describes the **binary / process / platform** — information that is identical across consecutive invocations. Per-invocation state (switches, answers) lives on [`archetype`](#archetype) instead. All fields are also available inside templates.

| Field | Type | Description |
|---|---|---|
| `archetect.version` | `string` | Full version string (e.g., `"3.0.0"`) |
| `archetect.version_major` | `integer` | Major version number |
| `archetect.version_minor` | `integer` | Minor version number |
| `archetect.version_patch` | `integer` | Patch version number |
| `archetect.is_offline` | `boolean` | `true` when launched in offline mode (`--offline`) |
| `archetect.is_headless` | `boolean` | `true` when launched in headless mode (no interactive prompts) |
| `archetect.locals_enabled` | `boolean` | `true` when local checkouts are configured |
| `archetect.env` | table | Platform info (below) |

### `archetect.env`

| Field | Type | Description |
|---|---|---|
| `os` | `string` | Target OS (e.g., `"linux"`, `"macos"`, `"windows"`) |
| `arch` | `string` | Target architecture (e.g., `"x86_64"`, `"aarch64"`) |
| `family` | `string` | `"unix"` or `"windows"` |
| `is_unix` | `boolean` | `family == "unix"` |
| `is_windows` | `boolean` | `family == "windows"` |
| `is_macos` | `boolean` | `os == "macos"` |

```lua
if archetect.env.is_windows then
    context:set("script-ext", "ps1")
else
    context:set("script-ext", "sh")
end
```

## `archetype`

The `archetype` global describes the **currently-rendering archetype**: manifest metadata plus the parameters supplied for *this* render. Also available inside templates.

| Member | Type | Description |
|---|---|---|
| `archetype.description` | `string` | Description from the [manifest](../archetype-manifest) |
| `archetype.directory` | `string` | Root directory path of the archetype |
| `archetype.destination` | `string` | Absolute path where files are being rendered (tracks `-d`) |
| `archetype.authors` | `string[]` | Author list from the manifest |
| `archetype.switches` | table | Switches supplied to this invocation |
| `archetype.answers()` | `table` | Fresh table of the pre-supplied answers |
| `archetype.mount_key()` | `string?` | Catalog map-key when running as a staged library |
| `archetype.is_library()` | `boolean` | `true` when executing inside a staged library |
| `archetype.is_standalone()` | `boolean` | `true` when *not* mounted as a staged library |
| `archetype.include_path(rel)` | `string` | Mount-aware include path for templates |

### `archetype.switches.is_enabled(name)`

```lua
if archetype.switches.is_enabled("debug") then
    log.info("debug switch enabled")
end
```

Returns `true` when the named switch was supplied to the current invocation (via `-s name` or a catalog entry). Note the **dot** call — `switches` is a plain table, not an object. There is no top-level `switches` global. See [Switches & Conditionals](../../authoring-archetypes/scripting/switches-and-conditionals).

### `archetype.answers()`

```lua
local answers = archetype.answers()
if answers["organization"] then ... end
```

Returns a fresh table (each call) of the raw answers supplied by the CLI, answer files, or a parent archetype. Useful for advanced patterns where you need to inspect answers independently of a Context — normally the pre-loading done by `Context.new()` is all you need.

### Library helpers: `mount_key`, `is_library`, `is_standalone`, `include_path`

These support archetypes that run as **staged libraries** — mounted by a parent's catalog entry with `library: true`. See [Libraries](../../authoring-archetypes/scripting/libraries).

```lua
archetype.mount_key()        --> string | nil
archetype.is_library()       --> boolean
archetype.is_standalone()    --> boolean
archetype.include_path(rel)  --> string
```

- `mount_key()` returns the catalog map-key the library was mounted under. It returns `nil` from the parent's own script and from a library running standalone (e.g. via a direct `archetect render`).
- `is_library()` is `true` exactly when `mount_key()` is non-nil; `is_standalone()` is its complement.
- `include_path(rel)` builds a path for template `{% include %}` directives. In library mode it returns `"<mount_key>/<rel>"`; standalone it returns `rel` unchanged (a standalone library's `includes/` is on the search path without a prefix).

```lua
-- In a library that publishes an include for its consumers:
context:set("editorconfig_include", archetype.include_path("editorconfig-rust.atl"))
```

## Case, Cases, and CaseStyle

Case expansion turns one prompted value into a family of consistently-cased keys and values. Full guide: [Casing](../../authoring-archetypes/scripting/casing).

### `Case.*` constants

`Case` holds one `CaseStyle` constant per style:

| Constant | Example output |
|---|---|
| `Case.Snake` | `my_project` |
| `Case.Pascal` | `MyProject` |
| `Case.Camel` | `myProject` |
| `Case.Kebab` | `my-project` |
| `Case.Train` | `My-Project` |
| `Case.Constant` | `MY_PROJECT` |
| `Case.Title` | `My Project` |
| `Case.Lower` | `my project` |
| `Case.Upper` | `MY PROJECT` |
| `Case.Sentence` | `My project` |
| `Case.Package` | `my.project` |
| `Case.Directory` | `my/project` |
| `Case.Cobol` | `MY-PROJECT` |
| `Case.Plural` | `my projects` |
| `Case.Singular` | `my project` |

### `CaseStyle:apply(input)`

Every `Case.*` constant can transform a string directly:

```lua
local pascal = Case.Pascal:apply("order service")  --> "OrderService"
```

### `Cases.*` constructors

| Function | Returns | Description |
|---|---|---|
| `Cases.programming()` | `CaseSpec` | Snake, Pascal, Camel, Kebab, Train, Constant |
| `Cases.all()` | `CaseSpec` | All 13 auto styles: the programming six plus Title, Lower, Upper, Sentence, Package, Directory, Cobol (no Plural/Singular) |
| `Cases.set(...)` | `CaseSpec` | A custom set of `Case.*` styles |
| `Cases.fixed(key, style)` | `CaseSpec` | Store the value transformed by `style` under the exact key `key` |
| `Cases.input(key)` | `CaseSpec` | Store the raw, untransformed input under the exact key `key` |

With auto styles (`programming`, `all`, `set`), **both the key and the value** are transformed per style. Prompting for `"project-name"` with `Cases.programming()` and an input of `My Project` stores:

| Key | Value |
|---|---|
| `project-name` | `My Project` |
| `project_name` | `my_project` |
| `projectName` | `myProject` |
| `ProjectName` | `MyProject` |
| `Project-Name` | `My-Project` |
| `PROJECT_NAME` | `MY_PROJECT` |

Combine constructors by passing a list:

```lua
context:prompt_text("Project Name:", "project-name", {
    cases = { Cases.programming(), Cases.fixed("project-title", Case.Title) },
})
```

## `Existing`

Policy enum for handling files that already exist at the destination, used as the `if_exists` option in [rendering functions](rendering).

| Constant | Behavior |
|---|---|
| `Existing.Overwrite` | Replace existing files |
| `Existing.Preserve` | Keep existing files unchanged (**default**) |
| `Existing.Prompt` | Ask the user what to do (interactive) |
| `Existing.Error` | Fail the render — useful for CI / idempotent pipelines |

```lua
directory.render("contents", context, { if_exists = Existing.Overwrite })
```

## `Location`

Path-resolution scope enum for `file.exists` / `file.read`, used as the `within` option.

| Constant | Resolves against |
|---|---|
| `Location.Archetype` | The archetype source root (**default**) |
| `Location.Destination` | The render destination — honors `-d`. Use this to inspect the output tree. |
| `Location.Cwd` | The actual process working directory. Diverges from `Destination` when `-d` is set. |

```lua
if file.exists(".git", { within = Location.Destination }) then
    log.info("destination is already a git repository")
end
```

## `exit()`

```lua
exit()
```

Cleanly terminates the script. It does not raise a user-visible error — it signals successful completion. Use for early termination when nothing further needs to happen:

```lua
if not context:prompt_confirm("Continue?", "continue", { default = true }) then
    output.print("Nothing to do.")
    exit()
end
```
