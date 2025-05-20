<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { scale } from 'svelte/transition';
	let dark = $state(false);
	onMount(() => {
		dark = localStorage.getItem('theme') === 'dark';
		document.documentElement.classList.toggle('dark', dark);
		document.documentElement.classList.add('dark:bg-gray-900');
		document.documentElement.classList.add('transition-colors');
		document.documentElement.classList.add('duration-1000');
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

<button onclick={toggleNav} class="bg-purple-500 p-2 text-white dark:bg-purple-600 transition-colors duration-1000">Menu</button>
{#if navVisible}
	<nav id="nav" class="absolute m-4 flex w-24 flex-col" transition:scale>
		<a
			href="/add-age"
			class="border-2 border-purple-500 bg-purple-500 p-2 text-white hover:border-y-gray-500 dark:border-purple-600 dark:bg-purple-600 dark:hover:border-y-gray-600 transition-colors duration-1000"
			>add age</a
		>
		<a
			href="/listing"
			class="border-2 border-purple-500 bg-purple-500 p-2 text-white hover:border-y-gray-500 dark:border-purple-600 dark:bg-purple-600 dark:hover:border-y-gray-600 transition-colors duration-1000"
			>listing</a
		>
		<button
			onclick={toggleDarkMode}
			class="border-2 border-black bg-black p-2 text-white hover:border-y-gray-600 dark:border-white dark:bg-gray-200 dark:text-black transition-colors duration-1000"
			>Dark Mode</button
		>
	</nav>
{/if}
{@render children()}
