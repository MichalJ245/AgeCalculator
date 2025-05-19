<script lang="ts">
	import { onMount } from 'svelte';
		let listOfItems: Array<{
		id: number;
		name: string;
		email: string;
		city: string | null;
		birthdate: string;
	}> = $state([]);
	let currentRow: number = $state(0);
	const getData = async () => {
		const response = await fetch('http://192.168.0.216:8000/users/api/submissions/');
		const json = await response.json();
		listOfItems = json;
		console.log(listOfItems[currentRow].city);
	};

	onMount(() => {
		getData();
	});
	function previous()
	{
		if(currentRow > 0)
	{
		currentRow--;
	}
	}
	function next()
	{
		if(currentRow < listOfItems.length-1)
	{
		currentRow++;
	}
	}
</script>
<h1 class="text-center font-bold text-3xl">Dane z tabeli</h1>
<div class="flex flex-col justify-center">
	{#if listOfItems[currentRow]}
			<div class="mx-auto my-6 w-64 rounded-[30px] bg-gray-300 p-4 dark:bg-gray-600 dark: font-white">
				<p><span class="font-bold text-purple-500 dark:text-purple-200">ID:</span> {listOfItems[currentRow].id}</p>
				<p><span class="font-bold text-purple-500 dark:text-purple-200">Name:</span> {listOfItems[currentRow].name}</p>
				<p><span class="font-bold text-purple-500 dark:text-purple-200">Email:</span> {listOfItems[currentRow].email}</p>
				{#if listOfItems[currentRow].city}
					<p><span class="font-bold text-purple-500 dark:text-purple-200">City:</span> {listOfItems[currentRow].city}</p>
				{/if}
				<p><span class="font-bold text-purple-500 dark:text-purple-200">Birthdate:</span> {listOfItems[currentRow].birthdate}</p>
				<div>
				<button onclick={previous} class="p-4 bg-purple-500 rounded-[10px] mr-32">&lt;</button>
				<button onclick={next} class="p-4 bg-purple-500 rounded-[10px]">&gt;</button>
				</div>
			</div>
	{:else}
		<p class="text-center">Brak danych, lub nie udało się nawiązać połączenia z serwerem</p>
	{/if}
</div>
