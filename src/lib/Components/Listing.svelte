<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	let listOfItems: Array<{
		id: number;
		name: string;
		email: string;
		city: string | null;
		birthdate: string;
	}> = $state([]);
	var jsonFile: any;
	let next: any = $state();
	let previous: any = $state();
	let page: number = $state(1);
	let size: number = $state(1);
	let dataCount: number = $state(1);
	let buttonArray: Array<number> = $state([]);
	let loading = $state(true);
	let index = 0;
	let order:
		| 'id'
		| 'name'
		| 'email'
		| 'birthdate'
		| 'city'
		| '-id'
		| '-name'
		| '-email'
		| '-birthdate'
		| '-city'
		| string = $state('id');
	const tableStyle =
		'border-b-[1px] border-gray-300 p-2 dark:border-white dark:text-white transition-colors duration-1000 border-collapse text-center ';
	const tableHeaderStyle = 'bg-gray-200 text-xl';
	const rowHoverStyle = 'hover:bg-gray-100 transition-colors duration-1000 dark:hover:bg-gray-700';
	const getData = async () => {
		try {
			loading = true;
			loadAnimate();
			const response = await fetch(
				`http://192.168.0.216:8000/users/api/submissions/?ordering=${order}&page=${page}&page_size=${size}`
			);
			jsonFile = await response.json();
			listOfItems = jsonFile.results;
			next = jsonFile.next;
			previous = jsonFile.previous;
			dataCount = jsonFile.count;
			checkPrev();
			checkNext();
			buttonNumber();
			loading = false;
			index = 0;
		} catch (e) {
			console.log(e);
		}
	};
	function updateURL() {
		let param = `ordering=${order}&page=${page}&page_size=${size}`;
		goto(`?${param}`);
	}
	$effect(() => {
		updateURL();
	});
	onMount(() => {
		updateURL();
		const params = new URLSearchParams(window.location.search);
		getData();
		order = String(params.get('ordering') || 'id');
		page = parseInt(params.get('page') || '1');
		size = parseInt(params.get('page_size') || '1');
	});
	let nextRight: boolean = $state(true);
	let nextLeft: boolean = $state(false);
	function checkPrev() {
		if (previous) {
			nextLeft = true;
		} else {
			nextLeft = false;
		}
	}
	function checkNext() {
		if (next) {
			nextRight = true;
		} else {
			nextRight = false;
		}
	}
	function nextPage() {
		page++;
		getData();
		checkNext();
	}
	function prevPage() {
		page--;
		getData();
		checkPrev();
	}
	function buttonArrow(side: boolean) {
		let buttonActive = 'bg-purple-500 text-white dark:bg-purple-600';
		let buttonNotActive = 'bg-gray-200 text-gray-800 dark:bg-gray-500 dark:text-white';
		return twMerge(
			'inline-block w-16 p-4 rounded-[10px] m-2 text-3xl',
			side ? buttonActive : buttonNotActive
		);
	}
	function orderBy(
		field:
			| 'id'
			| 'name'
			| 'email'
			| 'birthdate'
			| 'city'
			| '-id'
			| '-name'
			| '-email'
			| '-birthdate'
			| '-city'
	) {
		order = field;
		console.log(order);
		getData();
	}
	function buttonNumber() {
		buttonArray = [];
		let numOfButtons = Math.ceil(dataCount / size);
		let i = 1;
		for (i = 1; i <= numOfButtons; i++) {
			buttonArray.push(i);
		}
	}
	function sizeChange() {
		let handler = document.getElementById('size') as HTMLSelectElement;
		size = parseInt(handler.value);
		page = 1;
		getData();
	}
	function loadAnimate() {
		if (loading && document.getElementById('load')) {
			let handler = document.getElementById('load') as HTMLDivElement;
			switch (index) {
				case 0:
					handler.innerHTML = 'loading.';
					break;
				case 1:
					handler.innerHTML = 'loading..';
					break;
				case 2:
					handler.innerHTML = 'loading...';
					break;
			}
			if (index <= 2) {
				index++;
			} else {
				index = 0;
			}
			setTimeout(() => requestAnimationFrame(loadAnimate), 1000);
		} else if (loading) {
			setTimeout(() => requestAnimationFrame(loadAnimate), 1000);
		}
	}
</script>

<h1
	class="text-center text-3xl font-bold transition-colors transition-colors duration-1000 duration-1000 dark:text-white"
>
	Data from table
</h1>
<div class="flex flex-col justify-center">
	{#if loading}
		<p class="text-center text-3xl dark:text-white" id="load">loading</p>
	{:else if listOfItems}
		<table>
			<thead>
				<tr>
					<th
						onclick={() => {
							order == 'id' ? orderBy('-id') : orderBy('id');
						}}
						class={tableHeaderStyle}>ID</th
					>
					<th
						onclick={() => {
							order == 'name' ? orderBy('-name') : orderBy('name');
						}}
						class={tableHeaderStyle}>Name</th
					>
					<th
						onclick={() => {
							order == 'email' ? orderBy('-email') : orderBy('email');
						}}
						class={tableHeaderStyle}>Email</th
					>
					<th
						onclick={() => {
							order == 'birthdate' ? orderBy('-birthdate') : orderBy('birthdate');
						}}
						class={tableHeaderStyle}>Birthdate</th
					>
					<th
						onclick={() => {
							order == 'city' ? orderBy('-city') : orderBy('city');
						}}
						class={tableHeaderStyle}>City</th
					>
				</tr>
			</thead>
			<tbody>
				{#each listOfItems as item}
					<tr class={rowHoverStyle}>
						<td class={tableStyle}>{item.id}</td>
						<td class={tableStyle}>{item.name}</td>
						<td class={tableStyle}>{item.email}</td>
						<td class={tableStyle}>{item.birthdate}</td>
						<td class={tableStyle}>{item.city}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="flex justify-center">
			<button
				class={buttonArrow(nextLeft)}
				onclick={() => {
					if (nextLeft) {
						prevPage();
					}
				}}>&lt;</button
			>

			{#if buttonArray[page - 2] >= 1}
				<button
					class={buttonArrow(buttonArray[page - 2] == page)}
					onclick={() => {
						page = buttonArray[page - 2];
					}}>{buttonArray[page - 2]}</button
				>
			{/if}
			<button
				class={buttonArrow(buttonArray[page - 1] == page)}
				onclick={() => {
					page = buttonArray[page - 1];
				}}>{buttonArray[page - 1]}</button
			>
			{#if page < buttonArray.length}
				<button
					class={buttonArrow(buttonArray[page] == page)}
					onclick={() => {
						page = buttonArray[page];
					}}>{buttonArray[page]}</button
				>
			{/if}
			<button
				class={buttonArrow(nextRight)}
				onclick={() => {
					if (nextRight) {
						nextPage();
					}
				}}>&gt;</button
			>
		</div>
		<select
			id="size"
			onchange={sizeChange}
			class="m-auto w-64 rounded-[5px] border-1 p-2 dark:bg-gray-800 dark:text-white"
		>
			<option value="1">Show 1 row</option>
			<option value="2">Show 2 rows</option>
			<option value="3">Show 3 rows</option>
			<option value="4">Show 4 rows</option>
			<option value="5">Show 5 rows</option>
			<option value="10">Show 10 rows</option>
			<option value="15">Show 15 rows</option>
			<option value="20">Show 20 rows</option>
			<option value="25">Show 25 rows</option>
			<option value={dataCount}>Show all rows</option>
		</select>
	{:else}
		<p class="dark: text-center text-white">No data, or connection failed</p>
	{/if}
</div>
