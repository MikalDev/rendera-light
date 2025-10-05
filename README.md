# Rendera Light

A Construct 3 plugin for controlling lights in the Rendera 3D rendering engine. This plugin provides real-time lighting control for 3D scenes, supporting point lights, directional lights, and spot lights with full shadow casting capabilities.

## Overview

**Rendera Light** bridges Construct 3's 2D game engine with the Rendera 3D rendering system, enabling dynamic lighting control directly from the Construct 3 event system. Position lights in your scene using familiar Construct 3 coordinates, adjust colors and intensity in real-time, and configure advanced lighting properties like shadows, attenuation, and spot light angles.

### Key Features

- **Multiple Light Types**: Point, Directional, and Spot lights
- **Real-time Control**: Dynamic adjustment of all light properties during runtime
- **Shadow Casting**: Per-light shadow configuration
- **Position Syncing**: Automatic synchronization with Construct 3 object position (X, Y, Z-elevation)
- **Visual Debugging**: Optional debug visualization to see light positions in the editor
- **Multi-light Support**: Control up to 8 independent lights (indices 0-7)

## Installation

### For Users

1. Download the latest `.c3addon` file from the releases page
2. Open Construct 3
3. Go to **Menu → View → Addon Manager**
4. Click **Install from file**
5. Select the downloaded `.c3addon` file
6. Restart Construct 3 if prompted

### For Developers

#### Prerequisites
- Node.js (for TypeScript compilation)
- Construct 3 (with Developer Mode enabled)
- Git

#### Setup
```bash
# Clone the repository
git clone <repository-url>
cd rendera-light
npm install

# Copy rendera types (if rendera project is in sibling directory)
npm run copy-types

# Build TypeScript to JavaScript
npm run build
```

#### Using in Construct 3 Developer Mode
1. Enable **Developer Mode** in Construct 3 settings
2. Go to **Menu → Developer mode → Set up TypeScript for addon**
3. Select this project folder (creates `ts-defs/`)
4. Go to **Menu → View → Addon Manager → Add dev addon**
5. Select this project folder
6. Plugin appears as **"Rendera Light"** in the object types list

## Usage

### Basic Setup

1. Add a **Rendera Light** object to your layout
2. Configure the **Light Type** property (Point, Directional, or Spot)
3. Set the **Light Index** (0-7) to determine which Rendera light slot to control
4. Position the object in your layout (for Point and Spot lights)
5. Configure initial properties like color, intensity, and shadows

### Light Types

#### Point Light
Emits light in all directions from a single point in space.

**Properties:**
- Position (X, Y, Z)
- Color (RGB)
- Intensity
- Attenuation (distance falloff)
- Cast Shadows

**Use cases:** Torches, light bulbs, magical orbs

#### Directional Light
Emits parallel light rays in a specified direction (like sunlight).

**Properties:**
- Direction (X, Y, Z vector)
- Color (RGB)
- Intensity
- Cast Shadows

**Use cases:** Sun, moon, ambient directional lighting

#### Spot Light
Emits light in a cone shape from a point, aimed in a specific direction.

**Properties:**
- Position (X, Y, Z)
- Direction (X, Y, Z vector)
- Color (RGB)
- Intensity
- Attenuation (distance falloff)
- Spot Angle (cone angle in degrees)
- Spot Penumbra (soft edge falloff, 0-1)
- Cast Shadows

**Use cases:** Flashlights, stage lights, focused beams

### Example Usage

#### Dynamic Flashlight Effect
```
// Event: On player input
Actions:
  - RenderaLight: Set enabled to true
  - RenderaLight: Set intensity to 2.0
  - RenderaLight: Set spot angle to 30°

// Event: Every tick
Actions:
  - RenderaLight: Set position to (Player.X, Player.Y, 100)
  - RenderaLight: Set direction to (cos(Player.Angle), sin(Player.Angle), -0.5)
```

#### Day/Night Cycle
```
// Event: Every tick
Actions:
  - RenderaLight: Set color to RGB(lerp(1, 0.3, DayNightCycle), lerp(0.9, 0.2, DayNightCycle), lerp(0.7, 0.1, DayNightCycle))
  - RenderaLight: Set intensity to lerp(0.5, 2.0, DayNightCycle)
```

#### Flickering Torch
```
// Event: Every 0.1 seconds
Actions:
  - RenderaLight: Set intensity to random(0.8, 1.2)
```

## Available Actions, Conditions, and Expressions (ACEs)

### Actions

#### Set All Properties
Set all light properties in a single action (useful for initialization).

**Parameters:**
- Enabled (boolean)
- Red (0-1)
- Green (0-1)
- Blue (0-1)
- Intensity (number)
- Cast Shadows (boolean)
- Position X, Y, Z (numbers)
- Direction X, Y, Z (numbers)
- Attenuation (number)
- Spot Angle (degrees)
- Spot Penumbra (0-1)

#### Set Enabled
Enable or disable the light.

**Parameters:**
- Enabled (boolean)

#### Set Color
Set the RGB color of the light.

**Parameters:**
- Red (0-1)
- Green (0-1)
- Blue (0-1)

#### Set Intensity
Set the brightness multiplier of the light.

**Parameters:**
- Intensity (number, typically 0-10)

#### Set Cast Shadows
Enable or disable shadow casting for this light.

**Parameters:**
- Cast Shadows (boolean)

#### Set Direction
Set the direction vector (for directional and spot lights).

**Parameters:**
- X (number)
- Y (number)
- Z (number)

#### Set Attenuation
Set the distance falloff factor (for point and spot lights).

**Parameters:**
- Attenuation (number, higher = faster falloff)

#### Set Spot Angle
Set the cone angle in degrees (for spot lights).

**Parameters:**
- Angle (degrees, typically 10-90)

#### Set Spot Penumbra
Set the soft edge falloff (for spot lights).

**Parameters:**
- Penumbra (0-1, where 0 = hard edge, 1 = very soft)

### Conditions

No conditions are currently implemented. This may be expanded in future versions.

### Expressions

No expressions are currently implemented. This may be expanded in future versions.

## Properties

### Light Type
Dropdown selection: Point, Directional, or Spot
- Determines the type of light and which properties are relevant

### Light Index
Number (0-7)
- Selects which Rendera light slot this object controls
- Each index can only be controlled by one light object at a time

### Enabled
Boolean (default: true)
- Initial enabled state of the light

### Color
Color picker (default: white)
- Initial RGB color of the light
- Displayed as RGB values in 0-255 range in editor, converted to 0-1 range at runtime

### Intensity
Number (default: 1.0)
- Initial brightness multiplier
- Values above 1.0 create brighter lights, below 1.0 create dimmer lights

### Cast Shadows
Boolean (default: false)
- Whether this light should cast shadows
- Note: Shadow casting has performance implications

### Attenuation
Number (default: 1.0)
- Initial distance falloff factor for point and spot lights
- Higher values = faster falloff

### Direction X, Y, Z
Numbers (default: 0, -1, 0)
- Initial direction vector for directional and spot lights
- Normalized internally by Rendera

### Spot Angle
Number (default: 45)
- Initial cone angle in degrees for spot lights
- Converted to cosine internally for performance

### Spot Penumbra
Number (default: 0.1)
- Initial soft edge falloff for spot lights
- Range 0-1, where 0 = hard edge

### Debug Light
Boolean (default: false)
- Shows a 25x25 pixel colored quad at the light's position
- Useful for visualizing point and spot light positions during development
- Only visible when this property is enabled

## Development

### Commands

```bash
# Development
npm run build          # Compile TypeScript to JavaScript
npm run watch          # Auto-compile TypeScript on file changes
npm run rebuild        # Clean all .js files and rebuild
npm run clean          # Remove compiled .js files (where .ts exists)

# Packaging & Distribution
npm run package        # Build and create .c3addon file in dist/
npm run package:addon  # Create .c3addon without rebuilding
npm run copy-types     # Sync rendera-types from ../rendera/rendera-types

# Testing
npm run dev-server     # Start local dev server for Construct 3 testing

# Deployment
npm run setup:butler   # Setup itch.io butler for deployments
npm run deploy:itch    # Build, package, and upload to itch.io
npm run upload:itch    # Upload existing package to itch.io
```

### Project Structure

```
rendera-light/
├── src/
│   ├── c3runtime/          # Runtime plugin code (separate JS context)
│   │   ├── main.js         # Runtime entry point
│   │   ├── plugin.ts       # Runtime plugin initialization
│   │   ├── type.ts         # Runtime object type
│   │   ├── instance.ts     # Main instance logic (light control)
│   │   ├── actions.ts      # ACE actions implementation
│   │   ├── conditions.ts   # ACE conditions implementation
│   │   └── expressions.ts  # ACE expressions implementation
│   ├── plugin.ts           # Editor plugin class
│   ├── type.ts             # Editor object type class
│   ├── instance.ts         # Editor instance class
│   ├── addon.json          # Plugin metadata, version, file list
│   ├── aces.json           # Actions/Conditions/Expressions definitions
│   ├── lang/en-US.json     # Localization strings
│   └── icon.svg            # Plugin icon
├── ts-defs/                # Construct 3 SDK types (generated)
├── rendera-types/          # Rendera 3D engine types (copied from sibling project)
├── scripts/                # Build and deployment scripts
├── dist/                   # Generated .c3addon files
├── CLAUDE.md               # Detailed development guide for AI assistants
├── package.json            # NPM package configuration
└── README.md               # This file
```

### Architecture Notes

The plugin operates in two separate JavaScript contexts:

1. **Editor Context** (`src/plugin.ts`, `src/type.ts`, `src/instance.ts`)
   - Runs in Construct 3's editor UI
   - Handles property panels, visual representation
   - No access to runtime game logic

2. **Runtime Context** (`src/c3runtime/*.ts`)
   - Runs during game execution (preview/export)
   - Handles actual light control via Rendera API
   - No access to editor UI

Code cannot be shared between contexts. The runtime code in `c3runtime/` runs in a completely separate JavaScript environment.

### Integration with Rendera

The plugin accesses Rendera via `globalThis.rendera.gpuResourceManager`:

```typescript
globalThis.rendera.gpuResourceManager.updateLight(lightIndex, {
  type: 'point' | 'directional' | 'spot',
  enabled: boolean,
  color: [r, g, b],
  intensity: number,
  castShadows: boolean,
  position?: [x, y, z],      // For point and spot lights
  direction?: [x, y, z],     // For directional and spot lights
  attenuation?: number,      // For point and spot lights
  cosAngle?: number,         // For spot lights (computed from angle)
  spotPenumbra?: number      // For spot lights
});
```

Lights are updated every tick via the `_tick()` method, which automatically syncs Construct 3 position (X, Y, Z-elevation) to the Rendera light position for point and spot lights.

### Versioning

Use **Semantic Versioning** (Major.Minor.Patch):

- **Major (1.0.0 → 2.0.0)**: Breaking changes, incompatible API changes
- **Minor (1.0.0 → 1.1.0)**: New features, backwards compatible
- **Patch (1.0.0 → 1.0.1)**: Bug fixes, backwards compatible

**Update version in both**: `src/addon.json` (line 10) and `package.json` (line 3)

### Commit Message Convention (YANGI Pattern)

Format: `type: short description`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat: add dynamic light flickering action
fix: resolve shadow casting issue
docs: update lighting examples in README
refactor: optimize light update loop
```

## Important Notes

- **JavaScript files are git-ignored** but required locally for C3 to load the plugin
- **Both `.ts` and `.js` must exist** in `src/` for the plugin to work in Construct 3 developer mode
- **Run `npm run build` after pulling changes** to regenerate JavaScript files
- **Light index 0-7**: Rendera supports up to 8 simultaneous lights
- **Color values**: Use 0-1 range in actions (not 0-255)
- **Direction vectors**: Automatically normalized by Rendera, don't need to be unit length
- **Position syncing**: For point and spot lights, position is automatically synced from Construct 3 object position every tick

## Troubleshooting

### Light not appearing in scene
- Verify Rendera is properly initialized (`globalThis.rendera` exists)
- Check that the light index (0-7) is unique and not used by another light
- Ensure the light is enabled
- Verify intensity is not 0
- Check that the light is within range of visible 3D models

### Shadows not working
- Confirm "Cast Shadows" is enabled for the light
- Verify the Rendera scene has shadow mapping enabled
- Check that 3D models have shadow receiving enabled
- Note: Not all light types may support shadows in all Rendera configurations

### Position not updating
- For point and spot lights, position automatically syncs from X, Y, and Z-elevation
- For directional lights, position is not used (only direction matters)
- Check that the Rendera Light object is being moved, not just a sprite

### Debug visualization not showing
- Enable the "Debug Light" property in the object properties
- The debug quad only appears during runtime, not in the editor
- Check that the object's opacity is not 0

## License

MIT License - See LICENSE file for details

## Credits

**Author:** Mikal
**Website:** [https://www.kindeyegames.com](https://www.kindeyegames.com)

## Support

- See `CLAUDE.md` for detailed development information
- Check Construct 3 plugin documentation for SDK details
- Review `rendera-types/` for Rendera 3D engine integration options
- Visit [https://www.kindeyegames.com](https://www.kindeyegames.com) for support
