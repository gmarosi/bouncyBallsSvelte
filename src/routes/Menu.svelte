<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    function restartGame() {
        dispatch("restart");
    }

    export let playing: boolean;
</script>

<style>
    button {
      position: absolute;
      top: 50%;
      left: 50%;
      max-width: 200px;
      height: 10%;
      max-height: 100px;
    }
</style>

<form>
    <button on:click={restartGame} style="display: {playing ? "none" : "block"}">Restart game</button>
</form>