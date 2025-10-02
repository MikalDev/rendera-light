# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Rendera Controller**, a Construct 3 plugin that controls lights for the Rendera 3D rendering engine. It bridges Construct 3's 2D game engine with the Rendera 3D rendering system.

## Essential Commands

### Development
```bash
npm run build          # Compile TypeScript to JavaScript
npm run watch          # Auto-compile TypeScript on file changes
npm run rebuild        # Clean all .js files and rebuild
npm run clean          # Remove compiled .js files (where .ts exists)
```

### Packaging & Distribution
```bash
npm run package        # Build and create .c3addon file in dist/
npm run package:addon  # Create .c3addon without rebuilding
npm run copy-types     # Sync rendera-types from ../rendera/rendera-types
```

### Testing
```bash
npm run dev-server     # Start local dev server for Construct 3 testing
```

### Deployment
```bash
npm run setup:butler   # Setup itch.io butler for deployments
npm run deploy:itch    # Build, package, and upload to itch.io
npm run upload:itch    # Upload existing package to itch.io
```

## Architecture Overview

### Dual-Context Plugin System

The plugin operates in **two separate JavaScript contexts**:

1. **Editor Context** (`src/plugin.ts`, `src/type.ts`, `src/instance.ts`)
   - Runs in Construct 3's editor UI
   - Handles property panels, visual representation
   - No access to runtime game logic

2. **Runtime Context** (`src/c3runtime/*.ts`)
   - Runs during game execution (preview/export)
   - Handles actual 3D rendering, animations, model management
   - No access to editor UI

**Critical**: Code cannot be shared between contexts. The `c3runtime/` code runs in a completely separate JavaScript environment.

### Key Runtime Components

- **`c3runtime/instance.ts`**: Main instance class (`DrawingInstance`)
  - Manages individual 3D model instances
  - Syncs Construct 3 transforms (position, rotation, scale) with Rendera 3D models
  - Handles animation callbacks and event triggers
  - Uses `_tick()` for per-frame updates
  - Uses `_draw(renderer)` for rendering (both Rendera 3D and optional C3 sprite overlay)

- **`c3runtime/actions.ts`**: ACE actions (CreateModel, PlayAnimation, SetPosition, etc.)
- **`c3runtime/conditions.ts`**: ACE conditions (IsAnimationPlaying, OnAnimationFinished, etc.)
- **`c3runtime/expressions.ts`**: ACE expressions (GetPositionX, GetAnimationName, etc.)

### Integration with Rendera

The plugin accesses Rendera via `globalThis.rendera`:

```typescript
interface RenderaGlobal {
  instanceManager: InstanceManager;  // Create/remove 3D models
  registerAnimationCallback(id: InstanceId, callback: Function): void;
  unregisterAnimationCallback(id: InstanceId): void;
  draw(renderer: IRenderer): void;   // Called from _draw()
}
```

Models are created via `globalThis.rendera.instanceManager.createModel(path)` which may return `null` if still loading. The plugin uses a pending model queue pattern (`_pendingModelPath`) that retries creation each tick until successful.

### Transform Synchronization

The plugin automatically syncs Construct 3 properties to Rendera models in `_tick()`:

- **Position**: `this.x`, `this.y`, `this.zElevation` → `model.setPosition()`
  - Uses `totalZElevation` when part of a hierarchy (includes parent z-elevations)
- **Rotation**: `this.angle` (radians) → quaternion via `model.setRotation()`
  - Converts C3 2D angle to Y-axis 3D rotation
- **Color/Opacity**: `this.colorRgb`, `this.opacity` → `model.setTintColor()`, `model.setOpacity()`

Override flags (`_positionOverridden`, `_rotationOverridden`) prevent sync when actions manually set transforms.

## TypeScript Configuration

- **Target**: ES2021 (class fields transpiled for Closure Compiler)
- **Modules**: ES2022 (Construct 3 requires ES modules)
- **Strict Checks**: Partially enabled
  - ✅ `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`
  - ❌ `strict`, `noImplicitAny` (disabled for C3 `globalThis` usage)
- **Type Definitions**:
  - `ts-defs/`: Construct 3 SDK types (generated via C3 editor)
  - `rendera-types/`: Rendera 3D engine types (copied from sibling project)

## File Structure

```
src/
├── addon.json           # Plugin metadata, version, file list
├── aces.json            # Actions/Conditions/Expressions definitions
├── lang/en-US.json      # Localization strings
├── plugin.ts            # Editor plugin class
├── type.ts              # Editor object type class
├── instance.ts          # Editor instance class
└── c3runtime/           # Runtime-only code (separate JS context)
    ├── plugin.ts        # Runtime plugin initialization
    ├── type.ts          # Runtime object type
    ├── instance.ts      # Main instance logic (DrawingInstance)
    ├── actions.ts       # ACE actions implementation
    ├── conditions.ts    # ACE conditions implementation
    └── expressions.ts   # ACE expressions implementation
```

## Important Development Notes

1. **JavaScript files are git-ignored** but required locally for C3 to load the plugin. Always run `npm run build` after pulling changes.

2. **Both `.ts` and `.js` must exist** in `src/` for the plugin to work in Construct 3 developer mode.

3. **Version updates**: Change version in **both** `src/addon.json` (line 10) and `package.json` (line 3).

4. **Animation callbacks**: Must be registered via `rendera.registerAnimationCallback(instanceId, callback)` and unregistered on cleanup to prevent memory leaks.

5. **Model lifecycle**:
   - Models created via `_createModel()` → stored in `_pendingModelPath`
   - Retry creation in `_tick()` until `globalThis.rendera` is available
   - Clean up in `_release()` via `instanceManager.removeInstance()`

6. **Construct 3 Developer Mode Setup**:
   - Enable Developer Mode in C3 settings
   - Menu → Developer mode → Set up TypeScript for addon → select project folder
   - Menu → View → Addon Manager → Add dev addon → select project folder
   - Plugin appears as "Rendera Controller" in object types

## Commit Message Convention (YANGI Pattern)

Format: `type: short description`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat: add model rotation controls
fix: resolve texture loading crash
refactor: optimize rendering loop
```

## Rendera Types Location

The plugin depends on `rendera-types/` copied from the sibling Rendera project. If types are missing or outdated, run:

```bash
npm run copy-types
```

This expects `../rendera/rendera-types` to exist.
