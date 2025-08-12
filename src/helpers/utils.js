class Deferred {
    constructor() {
        this.resolve = null;
        this.reject = null;

        this.promise = new Promise((...args) => [this.resolve, this.reject] = args);
    }
}

const utils = {
    scaleToCover({
                     target,
                     width,
                     height,
                     safeWidth = 0,
                     safeHeight = 0,
                     originWidth = 0,
                     originHeight = 0
    }) {
        const bounds = target.getLocalBounds();

        const safeScale = Math.min(width / safeWidth, height / safeHeight);
        const baseScaleX = width / Math.min(width, originWidth ?? bounds.width);
        const baseScaleY = height / Math.min(height, originHeight ?? bounds.height);
        const baseScale = Math.max(baseScaleX, baseScaleY);

        target.scale.set(Math.min(safeScale, baseScale));
    },
    scaleToFit(target, width, height) {
        const bounds = target.getLocalBounds();
        const scaleX = width / bounds.width;
        const scaleY = height / bounds.height;
        const scale = Math.min(scaleX, scaleY);
        target.scale.set(scale);
    },
    centralize(target, width, height) {
        const bounds = target.getLocalBounds();
        target.pivot.set(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        target.position.set(width / 2, height / 2);
    },
    wait(time) {
        return new Promise(res => gsap.delayedCall(time, res));
    },
    deferred() {
        return new Deferred();
    },
};

export default utils;