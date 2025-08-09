import {Text} from 'pixi.js';
import {StateViews} from './constants/States';
import Events from './constants/Events';
import './styles.scss';
import App from './core/App';
import {gsap} from 'gsap';
import { initDevtools } from '@pixi/devtools';
import config from './config';

window.gsap = gsap;
const app = window.app = new App();
app.start(StateViews);

// Devtools
initDevtools({ renderer: app._renderer, stage: app.stage });

// Coordinates
window.showCoords = function showCoords() {
    const tooltip = new Text({
        text: '',
        style: {
            fontSize: 14,
            fill: '#ffffff',
            stroke: '#000000'
        }
    });
    app.stage.addChild(tooltip);

    const container = app.stage.children[0];
    container.eventMode = 'static';
    container.cursor = 'pointer';

    container.on('pointermove', (event) => {
        const globalPos = event.global;
        const localPos =  container.toLocal(globalPos);

        tooltip.text = `coords: (${localPos.x.toFixed(1)}, ${localPos.y.toFixed(1)})`;
        tooltip.position.set(globalPos.x + 10, globalPos.y + 10);
    });
}

// Cells
window.showCellCords = function showCellCords() {
    const tooltip = new Text({
        text: '',
        style: {
            fontSize: 14,
            fill: '#ffffff',
            stroke: '#000000'
        }
    });
    app.stage.addChild(tooltip);

    const container = app.stage.children[0];
    container.eventMode = 'static';
    container.cursor = 'pointer';

    container.on('pointermove', (event) => {
        const globalPos = event.global;
        const localPos = container.toLocal(globalPos);

        const gridX = Math.floor(localPos.x / config.cell.width);
        const gridY = Math.floor(localPos.y / config.cell.height);

        tooltip.text = `cell: (${gridX}, ${gridY})`;
        tooltip.position.set(globalPos.x + 10, globalPos.y + 10);
    });
};

// Logging
function log() {
    const styleName = 'color: #2c3e50; background-color: #ecf0f1; padding: 2px 6px; border-radius: 4px; font-weight: bold;';
    const styleArgs = 'color: #34495e;';

    Object.keys(Events).forEach((name) => {
        app.on(name, (...args) => {
            if (name === 'RESIZE') return;

            let formatString = `%c${name}%c`;
            const formatArgs = [styleName, ''];

            args.forEach(arg => {
                let str;
                if (typeof arg === 'object') {
                    try {
                        str = JSON.stringify(arg, null, 2);
                    } catch {
                        str = '[Circular]';
                    }
                } else {
                    str = String(arg);
                }
                formatString += ` %c${str}`;
                formatArgs.push(styleArgs);
            });

            console.log(formatString, ...formatArgs);
        });
    });
}
log();