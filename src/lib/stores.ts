import { writable } from "svelte/store";
import type { GameObject } from "$lib/types";

function createObjectStore() {
    const { subscribe, set, update } = writable(<GameObject[]>[]);

    return {
        subscribe,
        add: (object: GameObject) => update((array) => [...array, object]),
        remove: (object: GameObject) => update((array) => array.filter((element) => element !== object)),
        empty: () => set([]),
    }
}

export const gameObjects = createObjectStore();
