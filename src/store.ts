import { writable } from 'svelte/store';

    let tabs = [
        { id: 'tab 1', name: 'apple' },
        { id: 'tab 2', name: 'banana' },
        { id: 'tab 3', name: 'carrot' },
        { id: 'tab 4', name: 'doughnut' },
        { id: 'tab 5', name: 'egg' },
    ];

export const tabStore = writable(tabs);
