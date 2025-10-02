
/// <reference path="../../ts-defs/runtime/AddonSDK.d.ts" />
/// <reference path="../../rendera-types/modules/index.d.ts" />

import type { SDKInstanceClass } from "./instance.ts";

const C3 = globalThis.C3;

C3.Plugins.renderaLight.Acts =
{
	SetAllProperties(
		this: SDKInstanceClass,
		enabled: boolean,
		red: number,
		green: number,
		blue: number,
		intensity: number,
		castShadows: boolean,
		posX: number,
		posY: number,
		posZ: number,
		dirX: number,
		dirY: number,
		dirZ: number,
		attenuation: number,
		spotAngle: number,
		spotPenumbra: number
	)
	{
		// Update all internal properties
		this._enabled = enabled;
		this._color = [red, green, blue];
		this._intensity = intensity;
		this._castShadows = castShadows;
		this._direction = [dirX, dirY, dirZ];
		this._attenuation = attenuation;
		this._spotAngle = spotAngle;
		this._spotPenumbra = spotPenumbra;
	},

	SetEnabled(this: SDKInstanceClass, enabled: boolean)
	{
		this._enabled = enabled;
	},

	SetColor(this: SDKInstanceClass, red: number, green: number, blue: number)
	{
		this._color = [red, green, blue];
	},

	SetIntensity(this: SDKInstanceClass, intensity: number)
	{
		this._intensity = intensity;
	},

	SetCastShadows(this: SDKInstanceClass, castShadows: boolean)
	{
		this._castShadows = castShadows;
	},

	SetDirection(this: SDKInstanceClass, x: number, y: number, z: number)
	{
		this._direction = [x, y, z];
	},

	SetAttenuation(this: SDKInstanceClass, attenuation: number)
	{
		this._attenuation = attenuation;
	},

	SetSpotAngle(this: SDKInstanceClass, angle: number)
	{
		this._spotAngle = angle;
	},

	SetSpotPenumbra(this: SDKInstanceClass, penumbra: number)
	{
		this._spotPenumbra = penumbra;
	}
};
