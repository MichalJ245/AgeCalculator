import {store} from '$lib/Components/store';
import { goto } from '$app/navigation';


export function updateURL() {
		store.subscribe(value => {
		let param;
		if (value.name == '' && value.email == '') {
			param = `ordering=${value.order}&page=${value.page}&page_size=${value.size}`;
		} else if (value.name == '' && value.email != '') {
			param = `email=${value.email}&ordering=${value.order}&page=${value.page}&page_size=${value.size}`;
		} else if (value.name != '' && value.email == '') {
			param = `name=${value.name}&ordering=${value.order}&page=${value.page}&page_size=${value.size}`;
		} else {
			param = `email=${value.email}&name=${value.name}&ordering=${value.order}&page=${value.page}&page_size=${value.size}`;
		}
		goto(`?${param}`);
		})
		
	}