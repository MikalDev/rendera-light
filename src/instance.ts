
const SDK = globalThis.SDK;

const PLUGIN_CLASS = SDK.Plugins.renderaLight;

class RenderaLightInstance extends SDK.IWorldInstanceBase
{
	private _lightIndex: number = 0;
	private _lightType: string = "point";
	private _debugLight: boolean = false;

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
		this._debugLight = this._inst.GetPropertyValue("debug-light") as boolean;
	}

	OnPlacedInLayout()
	{
		// Initialise to size of light bulb icon
		this.OnMakeOriginalSize();
	}

	Draw(iRenderer: SDK.Gfx.IWebGLRenderer, iDrawParams: SDK.Gfx.IDrawParams)
	{
		// Only draw debug visualization if enabled
		if (!this._debugLight)
			return;

		// Draw a 25x25 quad centered at the instance position
		const size = 25;
		const halfSize = size / 2;

		const x = this._inst.GetX();
		const y = this._inst.GetY();

		const quad = new SDK.Quad(
			x - halfSize, y - halfSize,  // top-left
			x + halfSize, y - halfSize,  // top-right
			x + halfSize, y + halfSize,  // bottom-right
			x - halfSize, y + halfSize   // bottom-left
		);

		// Set solid color fill mode and draw quad with instance color
		iRenderer.SetColorFillMode();
		iRenderer.SetColor(this._inst.GetColor());
		iRenderer.Quad(quad);
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
		else if (id === "debug-light")
		{
			this._debugLight = value as boolean;
		}
	}

	LoadC2Property(name: string, valueString: string)
	{
		return false;		// not handled
	}
};

PLUGIN_CLASS.Instance = RenderaLightInstance;

export type { RenderaLightInstance as SDKEditorInstanceClass };