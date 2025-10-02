/*─────────────────────────────────────────────────────────────────────────────
  Rendera Light – editor TYPE
  Holds shared data across all light instances while in the editor.
─────────────────────────────────────────────────────────────────────────────*/

/// <reference path="../ts-defs/editor/sdk.d.ts" />

const SDK = (globalThis as any).SDK;
const PLUGIN_CLASS = SDK.Plugins.renderaLight;

/*──────────────────────── TYPE class ────────────────────────*/
class RenderaLightType extends SDK.ITypeBase {

    constructor(plugin: SDK.IPluginBase, iObjType: SDK.IObjectType) {
        super(plugin, iObjType);
    }

    /*──────────── Type cleanup – called when the very last instance is destroyed */
    Release(): void {
        // No special cleanup needed for light instances
    }
}

/* Register with Construct */
PLUGIN_CLASS.Type = RenderaLightType;

/* Export for use by instances */
export type {
    RenderaLightType,
    RenderaLightType as SDKRuntimeTypeClass
};