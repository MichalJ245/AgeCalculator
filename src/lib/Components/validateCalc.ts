	import {storeCalc} from '$lib/Components/storeCalc';
    import {get} from 'svelte/store';
export function validate()
{
    dayValidate();
    monthValidate();
    yearValidate();
}


function dayValidate() {
		storeCalc.update(value => {
		let handler = document.getElementById('day') as HTMLInputElement;
		value.day = parseInt(handler.value);
		if (
			(typeof value.day === 'number' &&
				(([4, 6, 9, 11].includes(value.month) && (value.day > 30 || value.day < 0)) ||
					([1, 3, 5, 7, 8, 10, 12].includes(value.month) && (value.day > 31 || value.day < 0)) ||
					(value.month == 2 && value.day > 29))) ||
			isNaN(value.day)
		) {
			value.dayError = true;
		} else {
			value.dayError = false;
		}
		return value;
	})
	}
	function monthValidate() {
		storeCalc.update(value => {
		let handler = document.getElementById('month') as HTMLInputElement;
		value.month = parseInt(handler.value);
		if ((typeof value.month === 'number' && (value.month < 0 || value.month > 12)) || isNaN(value.month)) {
			value.monthError = true;
		} else {
			value.monthError = false;
		}
		return value;
		})
	}
	function yearValidate() {
		storeCalc.update(value => {
		let handler = document.getElementById('year') as HTMLInputElement;
		value.year = parseInt(handler.value);
		if ((typeof value.year === 'number' && value.year >= get(storeCalc).currentDate.getFullYear()) || isNaN(value.year)) {
			value.yearError = true;
		} else {
			value.yearError = false;
		}
		return value;
		})
	}