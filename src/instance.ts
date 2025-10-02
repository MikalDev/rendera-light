
const SDK = globalThis.SDK;

const PLUGIN_CLASS = SDK.Plugins.renderaLight;

class RenderaLightInstance extends SDK.IWorldInstanceBase
{
	private _lightIndex: number = 0;
	private _lightType: string = "point";

	constructor(sdkType: SDK.ITypeBase, inst: SDK.IWorldInstance)
	{
		super(sdkType, inst);
	}

	Release()
	{
		// Cleanup light resources if needed
	}

	OnCreate()
	{
		// Get initial light properties
		this._lightIndex = this._inst.GetPropertyValue("light-index") as number;
		this._lightType = this._inst.GetPropertyValue("light-type") as string;
	}

	OnPlacedInLayout()
	{
		// Initialise to size of light bulb icon
		this.OnMakeOriginalSize();
	}

	Draw(iRenderer: SDK.Gfx.IWebGLRenderer, iDrawParams: SDK.Gfx.IDrawParams)
	{
		const texture = this.GetTexture();

		if (texture)
		{
			// Draw light bulb icon
			this._inst.ApplyBlendMode(iRenderer);
			iRenderer.SetTexture(texture);
			iRenderer.SetColor(this._inst.GetColor());
			iRenderer.Quad3(this._inst.GetQuad(), this.GetTexRect());
		}
		else
		{
			// Render placeholder with color based on light type
			iRenderer.SetAlphaBlend();
			iRenderer.SetColorFillMode();

			if (this.HadTextureError())
			{
				iRenderer.SetColorRgba(0.25, 0, 0, 0.25);
			}
			else
			{
				// Color based on light type
				if (this._lightType === "point")
					iRenderer.SetColorRgba(1, 1, 0, 0.5); // Yellow for point lights
				else if (this._lightType === "directional")
					iRenderer.SetColorRgba(1, 0.5, 0, 0.5); // Orange for directional lights
				else if (this._lightType === "spot")
					iRenderer.SetColorRgba(1, 0, 1, 0.5); // Magenta for spot lights
			}

			iRenderer.Quad(this._inst.GetQuad());
		}
	}

	GetTexture()
	{
		const image = this.GetObjectType().GetImage();
		return super.GetTexture(image);
	}

	IsOriginalSizeKnown()
	{
		return true;
	}

	GetOriginalWidth()
	{
		return this.GetObjectType().GetImage().GetWidth();
	}

	GetOriginalHeight()
	{
		return this.GetObjectType().GetImage().GetHeight();
	}

	OnMakeOriginalSize()
	{
		const image = this.GetObjectType().GetImage();
		this._inst.SetSize(image.GetWidth(), image.GetHeight());
	}

	HasDoubleTapHandler()
	{
		return true;
	}

	OnDoubleTap()
	{
		this.GetObjectType().EditImage();
	}

	OnPropertyChanged(id: string, value: EditorPropertyValueType)
	{
		if (id === "light-type")
		{
			this._lightType = value as string;
		}
		else if (id === "light-index")
		{
			this._lightIndex = value as number;
		}
	}

	LoadC2Property(name: string, valueString: string)
	{
		return false;		// not handled
	}
};

PLUGIN_CLASS.Instance = RenderaLightInstance;

export type { RenderaLightInstance as SDKEditorInstanceClass };