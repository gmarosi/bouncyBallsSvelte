<script lang="ts">
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
    <button style="display: {playing ? "none" : "block"}">Restart game</button>
</form>