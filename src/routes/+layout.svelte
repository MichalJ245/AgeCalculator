<script lang="ts">
	import {onMount} from 'svelte';
	import '../app.css';
	import {scale} from 'svelte/transition';
	let dark = $state(false);
	onMount(()=>{
	dark = localStorage.getItem('theme') === 'dark';
	document.documentElement.classList.toggle('dark',dark);
	});
function toggleDarkMode()
{
	dark = !dark;
	document.documentElement.classList.toggle('dark',dark);
	localStorage.setItem('theme',dark ? 'dark':'light');
}
let navVisible = $state(true);
function toggleNav()
{
navVisible = !navVisible;
}
	let { children } = $props();
</script>
<button onclick={toggleNav} class="bg-purple-500 p-2 text-white">Menu</button>
{#if navVisible}
<nav id="nav" class="flex flex-col w-24 absolute m-4" transition:scale>
<a href="/add-age" class="bg-purple-500 p-2 text-white dark:text-black border-2 border-purple-500 hover:border-y-gray-500">add age</a>
<a href="/listing" class="bg-purple-500 p-2 text-white border-2 border-purple-500 hover:border-y-gray-500">listing</a>
<button onclick={toggleDarkMode} class="bg-black text-white p-2 border-2 border-black hover:border-y-gray-600">Dark Mode</button>
</nav>
{/if}
{@render children()}
