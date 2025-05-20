<script lang="ts">
	import { onMount } from 'svelte';
	let listOfItems: Array<{
		id: number;
		name: string;
		email: string;
		city: string | null;
		birthdate: string;
	}> = $state([]);
	function sort() {
		let handler = document.getElementById('sort') as HTMLSelectElement;
		let sortValue = handler.value;
		switch (sortValue) {
			case 'id':
				listOfItems.sort((a, b) => a.id - b.id);
				break;
			case 'name':
				listOfItems.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case 'email':
				listOfItems.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case 'birthdate':
				listOfItems.sort(
					(a, b) => new Date(a.birthdate).getTime() - new Date(b.birthdate).getTime()
				);
				break;
			case 'city':
				listOfItems.sort((a, b) => {
					if (!a.city) return 1;
					if (!b.city) return -1;
					return a.city.localeCompare(b.city);
				});
		}
	}
	let currentRow: number = $state(0);
	const getData = async () => {
		const response = await fetch('http://192.168.0.216:8000/users/api/submissions/?sort_by=name&page=1&per_page=2');
		const json = await response.json();
		listOfItems = json;
		console.log(json);
	};

	onMount(() => {
		getData();
	});
	function previous() {
		if (currentRow > 0) {
			currentRow--;
		}
	}
	function next() {
		if (currentRow < listOfItems.length - 1) {
			currentRow++;
		}
	}
</script>

<h1 class="text-center text-3xl font-bold dark:text-white transition-colors duration-1000">Data from table</h1>
<div class="flex flex-col justify-center">
	{#if listOfItems[currentRow]}
		<div class="dark: font-white mx-auto my-6 w-64 rounded-[30px] bg-gray-300 p-4 dark:bg-gray-600 transition-colors duration-1000">
			<p class="dark:text-white transition-colors duration-1000">
				<span class="font-bold text-purple-500 dark:text-purple-600 transition-colors duration-1000">ID:</span>
				{listOfItems[currentRow].id}
			</p>
			<p class="dark:text-white transition-colors duration-1000">
				<span class="font-bold text-purple-500 dark:text-purple-600 transition-colors duration-1000">Name:</span>
				{listOfItems[currentRow].name}
			</p>
			<p class="dark:text-white transition-colors duration-1000">
				<span class="font-bold text-purple-500 dark:text-purple-600 transition-colors duration-1000">Email:</span>
				{listOfItems[currentRow].email}
			</p>
			<p class="dark:text-white transition-colors duration-1000">
				<span class="font-bold text-purple-500 dark:text-purple-600 transition-colors duration-1000">City:</span>
				{listOfItems[currentRow].city ? listOfItems[currentRow].city : 'null'}
			</p>
			<p class="dark:text-white transition-colors duration-1000">
				<span class="font-bold text-purple-500 dark:text-purple-600 transition-colors duration-1000">Birthdate:</span>
				{listOfItems[currentRow].birthdate}
			</p>
			<div>
				<button onclick={previous} class="mr-32 rounded-[10px] bg-purple-500 p-4 dark:bg-purple-600 transition-colors duration-1000">&lt;</button>
				<button onclick={next} class="rounded-[10px] bg-purple-500 p-4 dark:bg-purple-600 transition-colors duration-1000">&gt;</button>
			</div>
			<p>Sort by:</p>
			<select class="rounded-[5px] border-2 bg-white dark:bg-gray-700 dark:text-white transition-colors duration-1000" id="sort" onchange={sort}>
				<option value="id">ID</option>
				<option value="name">Name</option>
				<option value="email">Email</option>
				<option value="city">City</option>
				<option value="birthdate">Birthdate</option>
			</select>
		</div>
	{:else}
		<p class="text-center">No datas, or connection failed</p>
	{/if}
</div>
