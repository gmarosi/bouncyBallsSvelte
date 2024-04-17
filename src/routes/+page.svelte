<script lang="ts">
    import type { Collideable, Drawable, GameObject } from "$lib/types";
    
    function randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomCSSRGB() {
        return `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
    }

    function GameObjectFactory(x: number, y: number, velX: number, velY: number, size: number, cssColor: string, isFilled: boolean, isEvil: boolean): GameObject {
        return {
            x,
            y,
            velX,
            velY,
            size,
            cssColor,
            isFilled,
            isEvil,
            doesCollide: (object: Collideable) => {
                return Math.sqrt((x - object.x) ** 2 + (y - object.y) ** 2) <= size + object.size;
            },
        };
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
