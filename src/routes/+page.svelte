<script lang="ts">
    import type { Collideable, Drawable, GameObject } from "$lib/types";
    import { onMount } from "svelte";
    import { gameObjects } from "$lib/stores";
    import { page } from "$app/stores";
    
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

    function draw(object: GameObject, context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(object.x, object.y, object.size, 0, 2 * Math.PI);

        if (object.isFilled) {
            context.fillStyle = object.cssColor;
            context.fill();
        }
        else {
            context.strokeStyle = object.cssColor;
            context.lineWidth = 3;
            context.stroke();
        }
    }

    function updateGameObjectPosition(object: GameObject, canvas: HTMLCanvasElement) {
        if ((object.x + object.size) >= canvas.width) {
            object.velX = -(Math.abs(object.velX));
        }

        if ((object.x - object.size) <= 0) {
            object.velX = Math.abs(object.velX);
        }

        if ((object.y + object.size) >= canvas.height) {
            object.velY = -(Math.abs(object.velY));
        }

        if ((object.y - object.size) <= 0) {
            object.velY = Math.abs(object.velY);
        }

        object.x += object.velX;
        object.y += object.velY;
    }

    function loop(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        context.fillStyle = 'rgba(0, 0, 0, 0.25)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        for (let object of $gameObjects) {
            updateGameObjectPosition(object, canvas);
            draw(object, context);
        }

        // const isOver = game.update();
        // counter.textContent = `Ball count: ${game.ballCount}`;
        // if(isOver) {
        //     return;
        // }

        function callBack() {
            loop(canvas, context);
        }

        requestAnimationFrame(callBack);
    }

    let canvas: HTMLCanvasElement;

    onMount(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const context = canvas.getContext("2d");

        for (let i: number = 0; i < 20; i++) {
            const size: number = randomInt(10, 20);
            const x: number = randomInt(size, canvas.width - size);
            const y: number = randomInt(size, canvas.height - size);
            const velX: number = randomInt(-7, 7);
            const velY: number = randomInt(-7, 7);
            gameObjects.add(GameObjectFactory(x, y, velX, velY, size, randomCSSRGB(), true, false));
        }

        if (context instanceof CanvasRenderingContext2D) {
            for (let object of $gameObjects) {
                draw(object, context);
            }

            loop(canvas, context);
        }
    });
</script>

<style>
    canvas {
        max-width: 100%;
        max-height: 100%;
    }
</style>

<canvas bind:this={canvas}></canvas>
