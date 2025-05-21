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
	let dataCount: number;
	const tableStyle = 'border-1 dark:border-white dark:text-white transition-colors duration-1000 border-collapse text-center';
	const getData = async () => {
		const response = await fetch('http://192.168.0.216:8000/users/api/submissions/?ordering=id&page='+page+'&page_size='+size);
		jsonFile = await response.json();
		console.log(jsonFile.results);
		listOfItems = jsonFile.results;
		next = jsonFile.next;
		previous = jsonFile.previous;
		dataCount = jsonFile.count;
		checkPrev();
		checkNext();
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
	function setSize()
	{
		let handler = document.getElementById('count') as HTMLInputElement;
		size = parseInt(handler.value);
		if(size > dataCount)
	{
		alert("There are less records in the database than "+size);
	}
	else
	{
		page = 1;
		getData();
	}
	}
</script>

<h1 class="text-center text-3xl font-bold transition-colors duration-1000 dark:text-white transition-colors duration-1000">
	Data from table
</h1>
<div class="flex flex-col justify-center">
	{#if listOfItems}
		<table class={tableStyle}>
			<thead class={tableStyle}>
				<tr class={tableStyle}>
					<th>ID</th>
					<th>Name</th>
					<th>Email</th>
					<th>Birthdate</th>
					<th>City</th>
				</tr>
			</thead>
			<tbody class={tableStyle}>
				{#each listOfItems as item}
					<tr class={tableStyle}>
						<td class="border-1">{item.id}</td>
						<td class="border-1">{item.name}</td>
						<td class="border-1">{item.email}</td>
						<td class="border-1">{item.birthdate}</td>
						<td class="border-1">{item.city}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="flex justify-center">
		<button class={buttonArrow(nextLeft)} onclick={() => {if(nextLeft){prevPage();}}}>&lt;</button>
		<button class={buttonArrow(nextRight)} onclick={() => {if(nextRight){nextPage();}}}>&gt;</button>
		</div>
		<div class="flex justify-center">
		<input type="number" id="count" class="border-1 w-32 dark:bg-gray-900 dark:text-white transition-colors duration-1000">
		<button onclick={setSize} class="p-2 bg-purple-500 rounded-[10px] text-white dark:bg-purple-600 transition-colors duration-1000">Set</button>
		</div>
	{:else}
		<p class="text-center">No data, or connection failed</p>
	{/if}
</div>
