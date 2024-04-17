export interface Collideable {
    x: number;
    y: number;
    velX: number;
    velY: number;
    size: number;

    doesCollide: (object: Collideable) => boolean;
}

export interface Drawable {
    cssColor: string;
    isFilled: boolean;
}

export type GameObject = Collideable & Drawable & {isEvil: boolean};