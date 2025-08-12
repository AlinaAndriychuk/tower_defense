const config = {
    lang: 'en',
    entryState: 'menu',
    renderer: {
        antialias: false,
        backgroundAlpha: 0,
        backgroundColor: 0x000000,
        clearBeforeRender: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
    },
    state: {
        width: 960,
        height: 640,
        pivot: {
            x: 480,
            y: 320
        },
        safeWidth: 500,
        safeHeight: 500,
    },
    menu: {
        title: {
            y: 200
        },
        startButton: {
            width: 200,
            height: 70,
            color: 0xa0a0a0,
            y: 350
        }
    },
    levelSelector: {
        card: {
            width: 100,
            height: 100,
        },
        levels: [
            {
                id: 0,
                lives: 10,
                coins: 10,
                startDuration: 10,
                path: [
                    { x: 606, y: 80 },
                    { x: 606, y: 175 },
                    { x: 355, y: 175 },
                    { x: 355, y: 431 },
                    { x: 639, y: 431 },
                    { x: 639, y: 238, sort: 'backToFront' },
                    { x: 420, y: 238, sort: 'frontToBack' },
                    { x: 420, y: 366 },
                    { x: 574, y: 366 },
                    { x: 574, y: 334, sort: 'backToFront' },
                    { x: 735, y: 334 },
                ],
                cells: {
                    start: {x: 9, y: 3},
                    end: {x: 21, y: 15},
                },
                waves: [
                    {
                        enemies: [{type: 'medusa', count: 10}],
                        duration: 20,
                    },
                ]
            }
        ]
    },
    characters: {
        speedCoefficient: 100,
        scale: 0.5,
        medusa: {
            animationSpeed: 0.15,
            speed: 30,
            health: 50,
            delay: 1,
            damage: 1,
            coins: 10,
            spriteY: -15,
            collision: {
                radiusX: 20,
                radiusY: 20
            }
        },
        ariel: {
            animationSpeed: 0.15,
            speed: 1000,
            coins: 25,
            attack: 10,
            attackCooldown: 0.5,
            damage: 10,
            spriteY: -15,
            collision: {
                radiusX: 50,
                radiusY: 45
            }
        },
    },
    defender: {
        collision: {
            default: 0xffffff,
            disabled: 0xCB6872
        }
    },
    enemy: {
        healthBar: {
            width: 32,
            height: 1.5,
            y: 25
        },
        coins: {
            y: -20,
            duration: 0.5,
        }
    },
    defenders: ['ariel'],
    hud: {
        width: 150,
        height: 80,
        color: 0x000000,
        alpha: 0.3,
        stats: {
            x: 5,
            coins: {
                y: 5
            },
            lives: {
                y: 22
            },
            waveNumber: {
                y: 39
            },
            waveTimer: {
                y: 56
            }
        }
    },
    card_container: {
        width: 89.6,
        height: 128,
        y: 85,
        color: 0x000000,
        alpha: 0.3,
    },
    card: {
        text: {
            x: 5,
            y: 100
        },
        character: {
            scale: 0.7
        }
    },
    cell: {
        width: 32,
        height: 32,
    },
};

export default config;
