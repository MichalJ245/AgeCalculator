<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<a href="/add-age" class="bg-purple-500 text-white p-2 rounded-[50px] m-2">add age</a>
<a href="/listing" class="bg-purple-500 text-white p-2 rounded-[50px] m-2">listing</a>

{@render children()}
