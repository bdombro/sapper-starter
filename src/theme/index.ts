import { writable } from 'svelte/store'

const store = writable('dark')
// store.subscribe((next) => localStorage.setItem('themeStore', next));

export default store;