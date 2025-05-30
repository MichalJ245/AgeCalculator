<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { scale } from 'svelte/transition';
	let dark = $state(false);
	let isListing = $state(false);
	onMount(() => {
		dark = localStorage.getItem('theme') === 'dark';
		document.documentElement.classList.toggle('dark', dark);
		document.documentElement.classList.add('dark:to-purple-600');
		document.documentElement.classList.add('dark:from-gray-600');
		document.documentElement.classList.add('transition-colors');
		document.documentElement.classList.add('duration-1000');
		document.documentElement.classList.add('bg-linear-to-tr');
		document.documentElement.classList.add('from-white');
		document.documentElement.classList.add('to-purple-500');
		document.documentElement.classList.add('h-screen');
		document.documentElement.classList.add('bg-no-repeat');
	});
	function toggleDarkMode() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	}
	let navVisible = $state(false);
	function toggleNav() {
		navVisible = !navVisible;
	}
	let { children } = $props();
</script>

<button
	onclick={toggleNav}
	class="bg-purple-500 p-2 text-white transition-colors duration-1000 dark:bg-purple-600"
	>Menu</button
>
{#if navVisible}
	<nav id="nav" class="absolute m-4 flex w-24 flex-col" transition:scale>
		<a
			href="/add-age"
			class="border-2 border-purple-500 bg-purple-500 p-2 text-white transition-colors duration-1000 hover:border-y-gray-500 dark:border-purple-600 dark:bg-purple-600 dark:hover:border-y-gray-600"
			onclick={() => (isListing = false)}>add age</a
		>
		<a
			href="/listing"
			class="border-2 border-purple-500 bg-purple-500 p-2 text-white transition-colors duration-1000 hover:border-y-gray-500 dark:border-purple-600 dark:bg-purple-600 dark:hover:border-y-gray-600"
			onclick={() => (isListing = true)}>listing</a
		>
		<button
			onclick={toggleDarkMode}
			class="border-2 border-black bg-black p-2 text-white transition-colors duration-1000 hover:border-y-gray-600 dark:border-white dark:bg-gray-200 dark:text-black"
			>Dark Mode</button
		>
	</nav>
{/if}
{@render children()}
<p>Made with <a href="https://tabler.io/icons">Tabler</a></p>
