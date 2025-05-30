import {writable, derived} from 'svelte/store';
export const storeCalc = writable({
    day: 0,
    month: 0,
    year: 0,
    dayError: false,
    monthError: false,
    yearError: false,
    currentDate: new Date(),
    age: new Date(),
    countedDays: '--' as number|'--',
    countedMonths: '--' as number|'--',
    countedYears: '--' as number|'--',
    });