<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { onMount } from 'svelte';
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
	let order: 'id'|'name'|'email'|'birthdate'|'city'|'-id'|'-name'|'-email'|'-birthdate'|'-city' = $state('id');
	const tableStyle = 'border-b-[1px] border-gray-300 p-2 dark:border-white dark:text-white transition-colors duration-1000 border-collapse text-center ';
	const tableHeaderStyle = 'bg-gray-200 text-xl';
	const rowHoverStyle = 'hover:bg-gray-100 transition-colors duration-1000 dark:hover:bg-gray-700';
	const getData = async () => {
		const response = await fetch('http://192.168.0.216:8000/users/api/submissions/?ordering='+order+'&page='+page+'&page_size='+size);
		jsonFile = await response.json();
		console.log(jsonFile.results);
		listOfItems = jsonFile.results;
		next = jsonFile.next;
		previous = jsonFile.previous;
		dataCount = jsonFile.count;
		checkPrev();
		checkNext();
		buttonNumber();
	};
	onMount(() => {
		getData();
	});
	let nextRight: boolean = $state(true);
	let nextLeft: boolean = $state(false);
	function checkPrev()
	{
		if(previous)
	{
		nextLeft = true;
	}
	else
	{
		nextLeft= false;
	}
	}
	function checkNext()
	{
		if(next)
	{
		nextRight = true;
	}
	else
	{
		nextRight= false;
	}
	}
	function nextPage()
	{
		page++;
		checkNext();
		getData();
	}
	function prevPage()
	{
		page--;
		checkPrev();
		getData();
	}
	function buttonArrow(side: boolean) {
		let buttonActive = 'bg-purple-500 text-white dark:bg-purple-600';
		let buttonNotActive = 'bg-gray-200 text-gray-800 dark:bg-gray-500 dark:text-white';
		return twMerge('inline-block w-16 p-4 rounded-[10px] m-2 text-3xl', side ? buttonActive : buttonNotActive);
	}
	function orderBy(field: 'id'|'name'|'email'|'birthdate'|'city'|'-id'|'-name'|'-email'|'-birthdate'|'-city')
	{
		order = field;
		getData();
		console.log(order);
	}
	function buttonNumber()
	{
		buttonArray = [];
		let numOfButtons = Math.ceil(dataCount/size);
		let i = 1
		for(i = 1;i <= numOfButtons;i++)
	{
		buttonArray.push(i);
	}
	}
	function sizeChange()
	{
		let handler = document.getElementById('size') as HTMLSelectElement;
		size = parseInt(handler.value);
		getData();
	}
</script>

<h1 class="text-center text-3xl font-bold transition-colors duration-1000 dark:text-white transition-colors duration-1000">
	Data from table
</h1>
<div class="flex flex-col justify-center">
	{#if listOfItems}
		<table>
			<thead>
				<tr>
					<th onclick={() => {order == 'id' ? orderBy('-id'):orderBy('id')}} class={tableHeaderStyle}>ID</th>
					<th onclick={() => {order == 'name' ? orderBy('-name'):orderBy('name')}} class={tableHeaderStyle}>Name</th>
					<th onclick={() => {order == 'email' ? orderBy('-email'):orderBy('email')}} class={tableHeaderStyle}>Email</th>
					<th onclick={() => {order == 'birthdate' ? orderBy('-birthdate'):orderBy('birthdate')}} class={tableHeaderStyle}>Birthdate</th>
					<th onclick={ () => {order == 'city' ? orderBy('-city'):orderBy('city')}} class={tableHeaderStyle}>City</th>
				</tr>
			</thead>
			<tbody >
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
		<button class={buttonArrow(nextLeft)} onclick={() => {if(nextLeft){prevPage();}}}>&lt;</button>
		{#if buttonArray.length <= 5}
		{#each buttonArray as button}
		<button class={buttonArrow(button == page)} onclick={() => {page = button;getData()}}>{button}</button>
		{/each}
		{:else}
		{#if buttonArray[page-2] >= 1}
		<button class={buttonArrow(buttonArray[page-2] == page)} onclick={() => {page = buttonArray[page-2];getData()}}>{buttonArray[page-2]}</button>
		{/if}
		<button class={buttonArrow(buttonArray[page-1] == page)} onclick={() => {page = buttonArray[page-1];getData()}}>{buttonArray[page-1]}</button>
		{#if page < buttonArray.length}
		<button class={buttonArrow(buttonArray[page] == page)} onclick={() => {page = buttonArray[page];getData()}}>{buttonArray[page]}</button>
		{/if}
		{/if}
		<button class={buttonArrow(nextRight)} onclick={() => {if(nextRight){nextPage();}}}>&gt;</button>
		</div>
		<select id="size" onchange={sizeChange} class="m-auto w-64 border-1 rounded-[5px] p-2 dark:bg-gray-800 dark:text-white">
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
		<p class="text-center dark: text-white">No data, or connection failed</p>
	{/if}
</div>
