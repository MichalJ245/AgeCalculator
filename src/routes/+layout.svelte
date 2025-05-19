<script lang="ts">
	import {onMount} from 'svelte';
	import '../app.css';
	let dark = $state(false);
	onMount(()=>{
	dark = localStorage.getItem('theme') === 'dark' || false;
	console.log(localStorage.getItem('theme'));
	document.documentElement.classList.toggle('dark',dark);
	});
function toggleDarkMode()
{
	dark = !dark;
	document.documentElement.classList.toggle('dark',dark);
	localStorage.setItem('theme',dark ? 'dark':'light');
}

	let { children } = $props();
</script>

<a href="/add-age" class="m-2 rounded-[50px] bg-purple-500 p-2 text-white dark:text-black">add age</a>
<a href="/listing" class="m-2 rounded-[50px] bg-purple-500 p-2 text-white">listing</a>
<button onclick={toggleDarkMode} class="bg-black text-white p-2 rounded-[10px]">Dark Mode</button>

{@render children()}
