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
                    { x: 591, y: 80 },
                    { x: 591, y: 177 },
                    { x: 368, y: 177 },
                    { x: 368, y: 431 },
                    { x: 624, y: 431 },
                    { x: 624, y: 237, sort: 'backToFront' },
                    { x: 432, y: 237, sort: 'frontToBack' },
                    { x: 432, y: 367 },
                    { x: 561, y: 367 },
                    { x: 561, y: 334, sort: 'backToFront' },
                    { x: 720, y: 334 },
                ],
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
        medusa: {
            animationSpeed: 0.15,
            speed: 150,
            health: 150,
            delay: 0.2,
            damage: 1,
        },
        ariel: {
            animationSpeed: 0.15,
            speed: 150,
            coins: 25,
            attack: 10,
            delay: 0.2,
            damage: 1,
        },
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
    }
};

export default config;
