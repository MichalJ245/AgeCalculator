import {store} from '$lib/Components/store';
import {get} from 'svelte/store';

export function buttonNumber() {
    store.update(value => {
		let startPage = Math.max(1, value.page - 1);
		let endPage: number = get(store).page+ 1;
		value.buttonArray = [];
		let numOfButtons = Math.ceil(value.dataCount / value.size);
		let i = 1;
		if (numOfButtons <= 5) {
			for (i = 1; i <= numOfButtons; i++) {
				value.buttonArray.push(i);
			}
		} else {
			for (i = startPage; i <= endPage; i++) {
				value.buttonArray.push(i);
			}
			if (endPage < numOfButtons - 1) {
				value.buttonArray.push(-1);
			}
		}
		if (!value.buttonArray.includes(numOfButtons)) {
			value.buttonArray.push(numOfButtons);
		}
		if (value.buttonArray.includes(numOfButtons + 1)) {
			value.buttonArray.pop();
		}
        console.log(value.buttonArray)
        return value;
        })
	}