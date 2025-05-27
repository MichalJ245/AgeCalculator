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
	const getData = async () => {
		try {
			loading = true;
			loadAnimate();
			const r1 = await fetch(`http://192.168.0.216:8000/users/api/submissions/?`);
			jsonFile = await r1.json();
			dataCount = jsonFile.count;
			if (size > dataCount || Number.isNaN(size) || size < 1) {
				size = dataCount;
			}
			if (page > Math.ceil(dataCount / size) || Number.isNaN(page) || page < 1) {
				page = 1;
			}
			if (!orderValues.includes(order)) {
				order = 'id';
			}
			const response = await fetch(
				`http://192.168.0.216:8000/users/api/submissions/?ordering=${order}&page=${page}&page_size=${size}`
			);
			jsonFile = await response.json();
			listOfItems = jsonFile.results;
			next = jsonFile.next;
			next ? (nextRight = true) : (nextRight = false);
			previous = jsonFile.previous;
			previous ? (nextLeft = true) : (nextLeft = false);
			dataCount = jsonFile.count;
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
	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		order = String(params.get('ordering') || 'id');
		page = parseInt(params.get('page') || '1');
		size = parseInt(params.get('page_size') || '1');
		updateURL();
		getData();
	});
	let nextRight: boolean = $state(true);
	let nextLeft: boolean = $state(false);
	function arrowButtons(arg: 'next' | 'prev') {
		if (arg === 'next' && next) {
			page++;
			updateURL();
			getData();
		} else if (arg === 'prev' && previous) {
			page--;
			updateURL();
			getData();
		}
	}
	function buttonArrow(side: boolean) {
		let buttonActive = 'bg-gray-100 dark:text-gray-600';
		let buttonNotActive = 'text-gray-800 dark:bg-gray-700 dark:text-white';
		return twMerge(
			'inline-block w-12 p-2 rounded-[10px] my-2 text-xl',
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
		updateURL();
		getData();
	}
	function buttonNumber() {
		let startPage: number = Math.max(1,page-1);
		let endPage: number = page+1;
		buttonArray = [];
		let numOfButtons = Math.ceil(dataCount / size);
		let i = 1;
		if (numOfButtons <= 5) {
			for (i = 1; i <= numOfButtons; i++) {
				buttonArray.push(i);
			}
		} else {
		if(page >= numOfButtons-3)
		{
			endPage = numOfButtons -1;
		}
		console.log(endPage)
		for(i = startPage;i <= endPage;i++)
		{
			buttonArray.push(i)
		}
		buttonArray.push(-1)
		}
		if(!buttonArray.includes(numOfButtons))
		{
			buttonArray.push(numOfButtons);
		}
	}
	function sizeChange() {
		let handler = document.getElementById('size') as HTMLSelectElement;
		size = parseInt(handler.value);
		page = 1;
		updateURL();
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

<div class="m-4 flex flex-col justify-center rounded-[10px] py-4 outline-1 outline-gray-300">
	<select
		id="size"
		onchange={sizeChange}
		class="m-auto w-64 rounded-[5px] border-1 p-2 dark:bg-gray-800 dark:text-white"
	>
		<option value="1">Show 1 row</option>
		{#if dataCount >= 2}<option value="2">Show 2 rows</option>{/if}
		{#if dataCount >= 3}<option value="3">Show 3 rows</option>{/if}
		{#if dataCount >= 4}<option value="4">Show 4 rows</option>{/if}
		{#if dataCount >= 5}<option value="5">Show 5 rows</option>{/if}
		{#if dataCount >= 10}<option value="10">Show 10 rows</option>{/if}
		{#if dataCount >= 15}<option value="15">Show 15 rows</option>{/if}
		{#if dataCount >= 20}<option value="20">Show 20 rows</option>{/if}
		{#if dataCount >= 25}<option value="25">Show 25 rows</option>{/if}
		<option value={dataCount}>Show all rows</option>
	</select>
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
		<div class="flex justify-between">
			<button
				class={buttonArrow(true)}
				onclick={() => {
					if (nextLeft) {
						arrowButtons('prev');
					}
				}}>&lt;</button
			>
			<div class="flex justify-center">
				{#each buttonArray as btn}
					{#if btn === -1}
						<p>...</p>
					{:else}
						<button
							class={buttonArrow(btn === page)}
							onclick={() => {
								page = btn;
								updateURL();
								getData();
							}}
							aria-label="button"
						>
							{btn}
						</button>
					{/if}
				{/each}
			</div>
			<button
				class={buttonArrow(true)}
				onclick={() => {
					if (nextRight) {
						arrowButtons('next');
					}
				}}>&gt;</button
			>
		</div>
	{:else}
		<p class="dark: text-center text-white">No data, or connection failed</p>
	{/if}
</div>
