import {writable, derived} from 'svelte/store';
export const store = writable({
    page: 1,
    size: 1,
    order: 'id',
    name: '',
    email: '',
    dataCount: 1,
    listOfItems: [] as { id: number; name: string; email: string; birthdate: string; city: string }[],
    loading: true,
    next: '',
    prev: '',
    nextRight: true,
    nextLeft: false,
    buttonArray: [] as number[]
    });