import { writable } from "svelte/store";
import type { GameObject } from "$lib/types";

function createObjectStore() {
    const { subscribe, set, update } = writable(<GameObject[]>[]);

    return {
        subscribe,
        add: (object: GameObject) => update((array) => [...array, object]),
        empty: () => set([]),
    }
}

export const gameObjects = createObjectStore();
