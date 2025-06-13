const utils = {
    scaleToCover(target, width, height) {
        const bounds = target.getLocalBounds();
        const scaleX = width / bounds.width;
        const scaleY = height / bounds.height;
        const scale = Math.max(scaleX, scaleY);

        target.scale.set(scale);
    },
    scaleToFit(target, maxWidth, maxHeight) {
        const bounds = target.getLocalBounds();
        const scaleX = maxWidth / bounds.width;
        const scaleY = maxHeight / bounds.height;
        const scale = Math.min(scaleX, scaleY);

        target.scale.set(scale);
    },
    center(target, width, height) {
        const bounds = target.getLocalBounds();
        target.pivot.set(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        target.position.set(width / 2, height / 2);
    }
};

export default utils;