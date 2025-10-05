
const C3 = globalThis.C3;

class RenderaLightInstance extends globalThis.ISDKWorldInstanceBase
{
	// Light properties
	_lightType: string;
	_lightIndex: number;
	_enabled: boolean;
	_color: [number, number, number];
	_intensity: number;
	_castShadows: boolean;

	// Point/Spot light properties
	_attenuation: number;

	// Directional/Spot light properties
	_direction: [number, number, number];

	// Spot light properties
	_spotAngle: number;
	_spotPenumbra: number;

	// Debug
	_debugLight: boolean;

	constructor()
	{
		super();

		const properties = this._getInitProperties();
		if (properties)
		{
			// Property indices match the order in plugin.ts SetProperties
			// Light type is a combo property that returns 0, 1, or 2
			const lightTypeIndex = properties[0] as number;      // light-type (0=point, 1=directional, 2=spot)
			const lightTypeNames = ["point", "directional", "spot"];
			this._lightType = lightTypeNames[lightTypeIndex];

			this._lightIndex = properties[1] as number;          // light-index
			this._enabled = properties[2] as boolean;            // enabled

			// Color from C3 color property (array of [r, g, b] in 0-255 range)
			const colorValue = properties[3];
			const colorArray = Array.isArray(colorValue) ? colorValue : [1, 1, 1];
			this._color = [
				colorArray[0],
				colorArray[1],
				colorArray[2]
			];

			this._intensity = properties[4] as number;           // intensity
			this._castShadows = properties[5] as boolean;        // cast-shadows
			this._attenuation = properties[6] as number;         // attenuation
			this._direction = [
				properties[7] as number,                         // direction-x
				properties[8] as number,                         // direction-y
				properties[9] as number                          // direction-z
			];
			this._spotAngle = properties[10] as number;         // spot-angle
			this._spotPenumbra = properties[11] as number;      // spot-penumbra
			this._debugLight = properties[12] as boolean;       // debug-light
		}
		else
		{
			// Default values
			this._lightType = "point";
			this._lightIndex = 0;
			this._enabled = true;
			this._color = [1, 1, 1];
			this._intensity = 1.0;
			this._castShadows = false;
			this._attenuation = 1.0;
			this._direction = [0, -1, 0];
			this._spotAngle = 45;
			this._spotPenumbra = 0.1;
			this._debugLight = false;
		}

		// Set initial instance color to match light color
		this.colorRgb = [this._color[0], this._color[1], this._color[2]];

		// Enable ticking to update Rendera light properties
		this._setTicking(true);
	}

	_release()
	{
		super._release();
	}

	_tick()
	{
		// Sync instance color to match light color (create new array to trigger C3 setter)
		this.colorRgb = [this._color[0], this._color[1], this._color[2]];

		// Check if Rendera is available
		if (!globalThis.rendera || !globalThis.rendera.gpuResourceManager)
			return;

		const gpuResourceManager = globalThis.rendera.gpuResourceManager;

		// Build light parameters based on light type
		if (this._lightType === "point")
		{
			gpuResourceManager.updateLight(this._lightIndex, {
				type: 'point',
				enabled: this._enabled,
				color: this._color,
				intensity: this._intensity,
				castShadows: this._castShadows,
				position: [this.x, this.y, this.totalZElevation],
				attenuation: this._attenuation
			});
		}
		else if (this._lightType === "directional")
		{
			gpuResourceManager.updateLight(this._lightIndex, {
				type: 'directional',
				enabled: this._enabled,
				color: this._color,
				intensity: this._intensity,
				castShadows: this._castShadows,
				direction: this._direction
			});
		}
		else if (this._lightType === "spot")
		{
			gpuResourceManager.updateLight(this._lightIndex, {
				type: 'spot',
				enabled: this._enabled,
				color: this._color,
				intensity: this._intensity,
				castShadows: this._castShadows,
				position: [this.x, this.y, this.totalZElevation],
				direction: this._direction,
				attenuation: this._attenuation,
				cosAngle: Math.cos(this._spotAngle * Math.PI / 180),
				spotPenumbra: this._spotPenumbra
			});
		}
	}

	_draw(renderer: IRenderer)
	{
		// Only draw debug visualization if enabled
		if (!this._debugLight)
			return;

		// Draw a 25x25 quad centered at the instance position
		const size = 25;
		const halfSize = size / 2;

		const x = this.x;
		const y = this.y;

		const quad = new DOMQuad(
			new DOMPoint(x - halfSize, y - halfSize),
			new DOMPoint(x + halfSize, y - halfSize),
			new DOMPoint(x + halfSize, y + halfSize),
			new DOMPoint(x - halfSize, y + halfSize)
		);

		// Set solid color fill mode and draw quad with instance color
		renderer.setColorFillMode();
		const color = this._color;
		renderer.setColorRgba(color[0], color[1], color[2], this.opacity);
		renderer.quad(quad);
	}

	_saveToJson()
	{
		return {
			// data to be saved for savegames
		};
	}

	_loadFromJson(o: JSONValue)
	{
		// load state for savegames
	}
};

C3.Plugins.renderaLight.Instance = RenderaLightInstance;

export type { RenderaLightInstance as SDKInstanceClass };