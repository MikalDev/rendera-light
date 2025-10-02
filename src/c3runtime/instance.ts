
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

	constructor()
	{
		super();

		const properties = this._getInitProperties();
		if (properties)
		{
			// Property indices match the order in plugin.ts SetProperties
			this._lightType = properties[0] as string;           // light-type
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
		}

		// Enable ticking to update Rendera light properties
		this._setTicking(true);
	}

	_release()
	{
		super._release();
	}

	_tick()
	{
		debugger
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
		const imageInfo = this.objectType.getImageInfo();
		const texture = imageInfo.getTexture(renderer);

		if (!texture)
			return;			// dynamic texture load which hasn't completed yet; can't draw anything

		let quad = this.getBoundingQuad();
		const rcTex = imageInfo.getTexRect();

		renderer.setTexture(texture);

		if (this.runtime.isPixelRoundingEnabled)
		{
			const ox = Math.round(this.x) - this.x;
			const oy = Math.round(this.y) - this.y;

			if (ox !== 0 && oy !== 0)
			{
				quad = new DOMQuad(new DOMPoint(quad.p1.x + ox, quad.p1.y + oy),
								   new DOMPoint(quad.p2.x + ox, quad.p2.y + oy),
								   new DOMPoint(quad.p3.x + ox, quad.p3.y + oy),
								   new DOMPoint(quad.p4.x + ox, quad.p4.y + oy));
			}
		}

		renderer.quad3(quad, rcTex);
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