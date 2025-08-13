const Styles = {
    DEFAULT: {
        TITLE: {
            fontFamily: 'Times New Roman',
            fontSize: 15,
            fill: 0xffffff,
            stroke: 0x000000,
            dropShadow: {
                alpha: 0.5,
                angle: Math.PI / 6,
                blur: 2,
                color: 0x000000,
                distance: 1
            }
        },
        VALUE: {
            fontFamily: 'Times New Roman',
            fontSize: 15,
            fill: 0xFBFFB0,
            stroke: 0x000000,
            dropShadow: {
                alpha: 0.5,
                angle: Math.PI / 6,
                blur: 2,
                color: 0x000000,
                distance: 1
            }
        },
        BUTTON: {
            fontFamily: 'Times New Roman',
            fontSize: 15,
            fill: 0xffffff,
            stroke: 0x000000,
            dropShadow: {
                alpha: 0.5,
                angle: Math.PI / 6,
                blur: 2,
                color: 0x000000,
                distance: 1
            }
        }
    },
    MENU: {
        TITLE: {
            fontFamily: 'Times New Roman',
            fontSize: 64,
            fill: 0xffffff,
            stroke: 0x000000,
            dropShadow: {
                alpha: 0.5,
                angle: Math.PI / 6,
                blur: 2,
                color: 0x000000,
                distance: 1
            }
        },
        BUTTON: {
            fontFamily: 'Times New Roman',
            fontSize: 30,
            fill: 0xffffff,
            stroke: 0x000000,
            dropShadow: {
                alpha: 0.5,
                angle: Math.PI / 6,
                blur: 2,
                color: 0x000000,
                distance: 1
            }
        }
    },
    LEVEL: {
        DIVIDER: {
            width: 0.5,
            color: 0x000000,
            alpha: 0.1,
            join: 'round',
            cap: 'round',
            alignment: 0.5
        }
    },
    CHARACTER: {
        COINS: {
            fontFamily: 'Times New Roman',
            fontSize: 15,
            fill: 0xFBFFB0,
            stroke: 0x000000
        }
    },
    ENEMY: {
        HEALTH_BAR: {
            BORDER: {
                width: 1.5,
                color: 0x000000
            },
            EMPTY: {
                color: 0xcf4055
            },
            FULL: {
                color: 0x51cf40
            },
        },
    }
}

export default Styles;