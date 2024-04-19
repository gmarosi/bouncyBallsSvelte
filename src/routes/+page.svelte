<script lang="ts">
    import { GameObject, type Collideable, type Direction } from "$lib/types";
    import { onMount } from "svelte";
    import { gameObjects } from "$lib/stores";
    import Menu from "./Menu.svelte";   

    class Ball extends GameObject {
        constructor(x: number, y: number, velX: number, velY: number, size: number, cssColor: string, isFilled: boolean) {
            super(x, y, velX, velY, size, cssColor, isFilled);
        }

        onCollide(object: Collideable): void {
            const newColor: string = randomCSSRGB();
            if (object instanceof Ball) {
                this.cssColor = newColor;
                object.cssColor = newColor;
            }
        }
    }

    class EvilCircle extends GameObject {
        constructor(x: number, y: number, velX: number, velY: number, size: number, cssColor: string, isFilled: boolean) {
            super(x, y, velX, velY, size, cssColor, isFilled);
        }

        onCollide(object: Collideable): void {
            if (object instanceof GameObject && $gameObjects.includes(object)) {
                gameObjects.remove(object);
            }
        }

        move(direction: Direction, canvas: HTMLCanvasElement) {
            switch (direction) {
                case "Left":
                    this.x = this.x - this.size - this.velX < 0 ? this.size : this.x - this.velX;
                    break;
                case "Right":
                    this.x = this.x + this.size + this.velX > canvas.width ? canvas.width - this.size : this.x + this.velX;
                    break;
                case "Up":
                    this.y = this.y - this.size - this.velY < 0 ? this.size : this.y - this.velY;
                    break;
                case "Down":
                    this.y = this.y + this.size + this.velY > canvas.height ? canvas.height - this.size : this.y + this.velY;
                    break;
            }
        }
    }
    
    function randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomCSSRGB() {
        return `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
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

    function updateBallPosition(object: Ball, canvas: HTMLCanvasElement) {
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
            if (object instanceof Ball) {
                updateBallPosition(object, canvas);
            }

            for (let other of $gameObjects) {
                if (other === object) {
                    continue;
                }

                if (object.doesCollide(other)) {
                    object.onCollide(other);
                }
            }

            draw(object, context);
        }

        function callBack() {
            loop(canvas, context);
        }

        requestAnimationFrame(callBack);
    }

    function startGame(canvas: HTMLCanvasElement, ballNumber: number) {
        gameObjects.empty();
        
        for (let i: number = 0; i < ballNumber; i++) {
            const size: number = randomInt(10, 20);
            const x: number = randomInt(size, canvas.width - size);
            const y: number = randomInt(size, canvas.height - size);
            const velX: number = randomInt(-7, 7);
            const velY: number = randomInt(-7, 7);
            gameObjects.add(new Ball(x, y, velX, velY, size, randomCSSRGB(), true));
        }

        gameObjects.add(new EvilCircle(randomInt(15, canvas.width - 15), randomInt(15, canvas.height - 15),
                                        20, 20, 15, "white", false));
    }

    let canvas: HTMLCanvasElement;

    onMount(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const context = canvas.getContext("2d");

        startGame(canvas, 25);

        if (context instanceof CanvasRenderingContext2D) {
            for (let object of $gameObjects) {
                draw(object, context);
            }

            loop(canvas, context);
        }
    });
    $: playing = $gameObjects.filter((element) => element instanceof Ball).length > 0;

    function keydownHandler(event: KeyboardEvent) {
        debugger;
        const evils = $gameObjects.filter((element) => element instanceof EvilCircle);

        switch (event.code) {
                case "ArrowLeft":
                case "KeyA":
                    evils.forEach((element) => (<EvilCircle>element).move("Left", canvas));
                    break;
                case "ArrowRight":
                case "KeyD":
                    evils.forEach((element) => (<EvilCircle>element).move("Right", canvas));
                    break;
                case "ArrowUp":
                case "KeyW":
                    evils.forEach((element) => (<EvilCircle>element).move("Up", canvas));
                    break;
                case "ArrowDown":
                case "KeyS":
                    evils.forEach((element) => (<EvilCircle>element).move("Down", canvas));
                    break;
            }
    }
</script>

<style>
    :global(body) {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;

        overflow: hidden;
        margin: 0;
    }

    canvas {
        max-width: 100%;
        max-height: 100%;
    }

    h1 {
      font-size: 2rem;
      letter-spacing: -1px;
      position: absolute;
      margin: 0;
      top: -4px;
      right: 5px;

      color: transparent;
      text-shadow: 0 0 4px white;
    }

    p {
        display: block;
        position: absolute;
        margin: 0;
        top: 35px;
        right: 5px;
        color: #aaa;
    }
</style>

<svelte:window on:keydown={keydownHandler}></svelte:window>

<Menu {playing}/>
<h1>bouncing balls</h1>
<p>Ball count: {$gameObjects.filter((element) => element instanceof Ball).length}</p>
<canvas bind:this={canvas} style="display: {playing ? "block" : "none"}"></canvas>
