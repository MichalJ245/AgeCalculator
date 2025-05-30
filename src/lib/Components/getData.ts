export let value: any;
const orderValues = [
		'id',
		'name',
		'email',
		'birthdate',
		'city',
		'-id',
		'-name',
		'-email',
		'-birthdate',
		'-city'
	];
	import {store} from '$lib/Components/store';
import { get } from 'svelte/store';
import { buttonNumber } from './buttonNumber';
import {loadAnimate} from '$lib/Components/loadAnimate';
import {PUBLIC_API} from '$env/static/public';
export async function getData() {
    loadAnimate();
    let url;
    if(get(store).name == '' && get(store).email == '')
    {
     url = `${PUBLIC_API}?page=1&page_size=1`;
    }
    else if(get(store).name != '' && get(store).email =='')
    {
    url = `${PUBLIC_API}?name=${get(store).name}page=1&page_size=1`;
    }
    else if(get(store).name == '' && get(store).email != '')
    {
     url = `${PUBLIC_API}?email=${get(store).email}page=1&page_size=1`;
    }
    else
    {
     url = `${PUBLIC_API}?name=${get(store).name}&email=${get(store).name}&page=1&page_size=1`;
    }
    let response = await fetch(url)
    let jsonFile = await response.json();
    try {
        store.update(value => {
        value.dataCount =  jsonFile.count;
        if ((value.size > value.dataCount && value.dataCount > 0) || Number.isNaN(value.size) || value.size < 1) {
            value.size = value.dataCount;
        }
        if (value.page > Math.ceil(value.dataCount / value.size) || Number.isNaN(value.page) || value.page < 1) {
            value.page = 1;
        }
        if (!orderValues.includes(value.order)) {
            value.order = 'id';
        }
        return value;
        })
        if (get(store).name == '' && get(store).email == '') {
            response = await fetch(
                `${PUBLIC_API}?&ordering=${get(store).order}&page=${get(store).page}&page_size=${get(store).size}`
            );
        } else if (get(store).name != '' && get(store).email == '') {
            response = await fetch(
                `${PUBLIC_API}?name=${get(store).name}&ordering=${get(store).order}&page=${get(store).page}&page_size=${get(store).size}`
            );
        } else if (get(store).name == '' && get(store).email != '') {
            response = await fetch(
                `${PUBLIC_API}?email=${get(store).email}&ordering=${get(store).order}&page=${get(store).page}&page_size=${value.size}`
            );
        } else {
            response = await fetch(
                `${PUBLIC_API}?name=${get(store).name}&email=${get(store).email}&ordering=${get(store).order}&page=${get(store).page}&page_size=${get(store).size}`
            );
        }
        jsonFile = await response.json();
        store.update(value => {
        value.next = jsonFile.next;
        value.next ? (value.nextRight = true) : (value.nextRight = false);
        value.prev = jsonFile.previous;
        value.prev ? (value.nextLeft = true) : (value.nextLeft = false);
        get(store).dataCount = jsonFile.count;
        return value;
        })
        store.update(prev => ({
            ...prev,
            listOfItems: jsonFile.results,
            loading: false
        }))
        buttonNumber();
    } catch (e) {
        console.log(e);
    }
};