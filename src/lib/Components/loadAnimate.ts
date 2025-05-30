import {store} from '$lib/Components/store';
import { get } from 'svelte/store';
let index: number = 0;
export function loadAnimate() {
		if (get(store).loading && document.getElementById('load')) {
			let handler = document.getElementById('load') as HTMLDivElement;
			switch (index) {
				case 0:
					handler.innerHTML = 'loading';
					break;
				case 1:
					handler.innerHTML = 'loading.';
					break;
				case 2:
					handler.innerHTML = 'loading..';
					break;
				case 3:
					handler.innerHTML = 'loading...';
					break;
			}
			if (index <= 2) {
				index++;
			} else {
				index = 0;
			}
			setTimeout(() => requestAnimationFrame(loadAnimate), 500);
		} else if (get(store).loading) {
			setTimeout(() => requestAnimationFrame(loadAnimate), 500);
		}
	}
