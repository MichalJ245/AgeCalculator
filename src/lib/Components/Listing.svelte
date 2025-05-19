<script lang="ts">
	import { onMount } from 'svelte';
	let listOfItems: Array<{
		id: number;
		name: string;
		email: string;
		city?: string;
		birthdate: string;
	}>;
	const getData = async () => {
		const response = await fetch('http://192.168.0.216:8000/users/api/submissions/');
		const json = await response.json();
		console.log(json);
		listOfItems = json;
	};

	onMount(() => {
		getData();
	});
</script>

<div class="flex flex-col justify-center">
	{#if listOfItems}
		{#each listOfItems as item}
			<div class="mx-auto my-6 w-64 rounded-[30px] bg-gray-300 p-4 dark:bg-gray-600 dark: font-white">
				<p><span class="font-bold text-purple-500 dark:text-purple-200">ID:</span> {item.id}</p>
				<p><span class="font-bold text-purple-500 dark:text-purple-200">Name:</span> {item.name}</p>
				<p><span class="font-bold text-purple-500 dark:text-purple-200">Email:</span> {item.email}</p>
				{#if item.city}
					<p><span class="font-bold text-purple-500 dark:text-purple-200">City:</span> {item.city}</p>
				{/if}
				<p><span class="font-bold text-purple-500 dark:text-purple-200">Birthdate:</span> {item.birthdate}</p>
			</div>
		{/each}
	{:else}
		<p>Brak danych</p>
	{/if}
</div>
