import './styles.scss';
import {StateViews} from './constants/States';
import App from './core/App';
import eventBus from './core/EventBus';
import Events from './constants/Events';

const app = window.app = new App();

app.start(StateViews);

// Logging
const styleName = 'color: #2c3e50; background-color: #ecf0f1; padding: 2px 6px; border-radius: 4px; font-weight: bold;';
const styleArgs = 'color: #34495e;';

Object.keys(Events).forEach((name) => {
    eventBus.on(name, (...args) => {
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
