<script lang="ts">
	import { store } from '$lib/Components/store';
	import { scale } from 'svelte/transition';
	import { returnSVG } from '$lib/Components/returnSVG';
	import { get } from 'svelte/store';
	import { updateURL } from '$lib/Components/updateURL';
	import { getData } from '$lib/Components/getData';
</script>

<form
	autocomplete="off"
	id="form"
	class="absolute ml-[60%] grid w-auto grid-cols-2 rounded-[10px] border-1 bg-white p-2 transition-colors duration-1000 dark:border-gray-700 dark:bg-gray-900"
	transition:scale
>
	<label for="name" class="m-2 inline text-2xl transition-colors duration-1000 dark:text-white"
		>{@html returnSVG('name')} Find in names:</label
	>
	<input
		type="text"
		id="name"
		class="m-2 inline w-auto rounded-[10px] border-1 p-2 text-xl transition-colors duration-1000 dark:border-white dark:text-white"
	/>
	<label for="email" class="m-2 inline text-2xl transition-colors duration-1000 dark:text-white">
		{@html returnSVG('email')} Find in emails:</label
	>
	<input
		type="text"
		id="email"
		class="m-2 inline w-auto rounded-[10px] border-1 p-2 text-xl transition-colors duration-1000 dark:border-white dark:text-white"
	/>
	<input
		type="button"
		onclick={() => {
			let handler = document.getElementById('form') as HTMLFormElement;
			handler.reset();
			get(store).name = '';
			get(store).email = '';
			getData();
			updateURL();
		}}
		value="reset"
		class="w-8, dark:bg-purlpe-600 m-2 h-8 rounded-[5px] bg-purple-500 p-1 text-white transition-colors duration-1000"
	/>
</form>
