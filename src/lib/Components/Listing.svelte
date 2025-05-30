<script lang="ts">
	import { onMount } from 'svelte';
	import Table from '$lib/Components/Table.svelte';
	import {getData} from '$lib/Components/getData';
	import {store} from '$lib/Components/store';
	import {updateURL} from '$lib/Components/updateURL';
	import LoadingScreen from '$lib/Components/loadingScreen.svelte';
	import {returnSVG} from '$lib/Components/returnSVG';
	import Filters from '$lib/Components/filters.svelte';
	import Nav from '$lib/Components/nav.svelte';
	let filterVisible: boolean = $state(false);
	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		store.set({
		...$store,
		order: String(params.get('ordering') || 'id'),
		page: parseInt(params.get('page') || '1'),
		size: parseInt(params.get('page_size') || '1')})
		if (params.get('name') != null) {
			store.set({...$store,name: String(params.get('name'))});
		} else {
			store.set({...$store,name: ''});
		}
		if (params.get('email')) {
			store.set({...$store,email: String(params.get('email'))});
		} else {
			store.set({...$store,email: ''});
		}
		updateURL();
		getData();
	});
	function getParams() {
		let nameHandler = document.getElementById('name') as HTMLInputElement;
		let emailHandler = document.getElementById('email') as HTMLInputElement;
		$store.name = nameHandler.value;
		$store.email = emailHandler.value;
		getData();
		updateURL();
	}
	function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
		let timeout: ReturnType<typeof setTimeout> | null = null;
		return function (this: unknown, ...args: Parameters<T>) {
			if (timeout != null) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(() => func.apply(this, args), delay);
			console.log('aaa');
		};
	}
	const debounceSearch = debounce(getParams, 1000);
	function filterToggle() {
		filterVisible = !filterVisible;
		setTimeout(
			() => document.getElementById('name')?.addEventListener('input', debounceSearch),
			100
		);
		setTimeout(
			() => document.getElementById('email')?.addEventListener('input', debounceSearch),
			100
		);
	}
</script>

<div
	class="m-4 flex flex-col justify-center rounded-[10px] bg-white py-4 outline-6 outline-gray-300 transition-colors duration-1000 dark:bg-gray-900 dark:outline-gray-700"
>
	{#if $store.loading}
		<LoadingScreen />
	{:else if $store.listOfItems && $store.listOfItems.length > 0}
		<div class="relative">
			<button aria-label="button" class="ml-[90%]" onclick={filterToggle}
				>{@html returnSVG('filter')}</button
			>
			{#if filterVisible}
				<Filters />
			{/if}
		</div>
		<Table />
		<Nav />
		<p class="m-2 transition-colors duration-1000 dark:text-white">
			Showing {$store.listOfItems.length} of {$store.dataCount} results
		</p>
	{:else}
		<p class="dark: text-center text-white transition-colors duration-1000">
			No data, or connection failed
		</p>
	{/if}
</div>
