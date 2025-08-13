import {Container, Graphics, Text} from 'pixi.js';

export default class Button extends Container {
    constructor({
                    width = 0,
                    height = 0,
                    color = 0x000000,
                    text = '',
                    style = null,
                }) {
        super();

        this._width = width;
        this._height = height;
        this._color = color;
        this._text = text;
        this._style = style;
        this._isEnabled = false;

        this._init();
    }

    _init() {
        this._createBackground();
        this._createText();
        this._enable();
        this._resize();
    }

    _createBackground() {
        const graphics = new Graphics()
            .rect(0, 0, this._width, this._height)
            .fill({ color: this._color });
        this.addChild(graphics);
    }

    _createText() {
        if (!this._text || !this._style) return;

        const text = new Text({
            text: this._text,
            style: this._style,
        });
        text.anchor.set(0.5);
        text.x = this.width / 2;
        text.y =  this.height / 2;
        this.addChild(text);
    }

    _enable() {
        if (this._isEnabled) return;

        this._isEnabled = true;
        this.eventMode = 'static';
        this.cursor = 'pointer';
    }

    _resize() {
        this.pivot.set(this.width / 2, this.height / 2);
    }

    get isEnabled() {
        return this._isEnabled;
    }
}