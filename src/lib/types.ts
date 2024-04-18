export interface Collideable {
    x: number;
    y: number;
    velX: number;
    velY: number;
    size: number;

    doesCollide: (object: Collideable) => boolean;
    onCollide: (object: Collideable) => void;
}

export interface Drawable {
    cssColor: string;
    isFilled: boolean;
}

export class GameObject implements Collideable, Drawable {
    x: number;
    y: number;
    velX: number;
    velY: number;
    size: number;

    cssColor: string;
    isFilled: boolean;

    constructor(x: number, y: number, velX: number, velY: number, size: number, cssColor: string, isFilled: boolean) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.size = size;
        this.cssColor = cssColor;
        this.isFilled = isFilled;
    }

    doesCollide(object: Collideable) {
        const dx = (this.x - object.x);
        const dy = (this.y - object.y);
        return Math.sqrt(dx * dx + dy * dy) <= this.size + object.size;
    }

    onCollide(object: Collideable) {}
}