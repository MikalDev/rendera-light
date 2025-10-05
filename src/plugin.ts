
/// <reference path="../ts-defs/editor/sdk.d.ts" />
/// <reference path="../rendera-types/modules/index.d.ts" />

import type { ModelId } from '../rendera-types/modules/index';

const SDK = globalThis.SDK;

////////////////////////////////////////////
// The plugin ID is how Construct identifies different kinds of plugins.
// *** NEVER CHANGE THE PLUGIN ID! ***
// If you change the plugin ID after releasing the plugin, Construct will think it is an entirely different
// plugin and assume it is incompatible with the old one, and YOU WILL BREAK ALL EXISTING PROJECTS USING THE PLUGIN.
// Only the plugin name is displayed in the editor, so to rename your plugin change the name but NOT the ID.
// If you want to completely replace a plugin, make it deprecated (it will be hidden but old projects keep working),
// and create an entirely new plugin with a different plugin ID.
const PLUGIN_ID = "renderaLight";
////////////////////////////////////////////

const PLUGIN_CATEGORY = "general";

let app = null;

const PLUGIN_CLASS = SDK.Plugins.renderaLight = class RenderaLightPlugin extends SDK.IPluginBase
{
	constructor()
	{
		super(PLUGIN_ID);
		
		SDK.Lang.PushContext("plugins." + PLUGIN_ID.toLowerCase());
		
		this._info.SetName(globalThis.lang(".name"));
		this._info.SetDescription(globalThis.lang(".description"));
		this._info.SetCategory(PLUGIN_CATEGORY);
		this._info.SetAuthor("Mikal");
		this._info.SetHelpUrl(globalThis.lang(".help-url"));
		this._info.SetPluginType("world");			// mark as world plugin, which can draw
		this._info.SetIsResizable(true);			// allow to be resized
		this._info.SetIsRotatable(true);			// allow to be rotated
		this._info.SetIs3D            (true);
		this._info.SetSupportsZElevation(true);	// support z-elevation for 3D positioning
		this._info.SetHasImage(true);			// has icon image for editor visualization
		this._info.SetSupportsEffects(false);		// lights don't need effects
		this._info.SetSupportsColor(true);
		this._info.SetMustPreDraw(false);
		this._info.SetRuntimeModuleMainScript("c3runtime/main.js");
		
		// Add common scene graph ACEs (actions, conditions, expressions)
		this._info.AddCommonSceneGraphACEs();

		// Add common world position ACEs
		this._info.AddCommonPositionACEs();

		SDK.Lang.PushContext(".properties");
		
		this._info.SetProperties([
			/* --- Light Type ------------------------------------------- */
			new SDK.PluginProperty("combo", "light-type", {
				initialValue: "point",
				items: ["point", "directional", "spot"]
			}),

			/* --- Light Index ------------------------------------------- */
			new SDK.PluginProperty("integer", "light-index", 0),

			/* --- Base Light Properties --------------------------------- */
			new SDK.PluginProperty("check", "enabled", true),
			new SDK.PluginProperty("color", "color", [255, 255, 255]),
			new SDK.PluginProperty("float", "intensity", { interpolatable: true, initialValue: 1.0 }),
			new SDK.PluginProperty("check", "cast-shadows", false),

			/* --- Point/Spot Light Properties --------------------------- */
			new SDK.PluginProperty("float", "attenuation", { interpolatable: true, initialValue: 1.0 }),

			/* --- Directional/Spot Light Properties --------------------- */
			new SDK.PluginProperty("float", "direction-x", 0),
			new SDK.PluginProperty("float", "direction-y", -1),
			new SDK.PluginProperty("float", "direction-z", 0),

			/* --- Spot Light Properties --------------------------------- */
			new SDK.PluginProperty("float", "spot-angle", { interpolatable: true, initialValue: 45 }),
			new SDK.PluginProperty("float", "spot-penumbra", { interpolatable: true, initialValue: 0.1 }),

			/* --- Debug ------------------------------------------------- */
			new SDK.PluginProperty("check", "debug-light", false)
		]);
		
		SDK.Lang.PopContext();		// .properties
		
		SDK.Lang.PopContext();
	}
};

PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS);
