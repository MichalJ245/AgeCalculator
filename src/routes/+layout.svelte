<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<a href="/add-age" class="m-2 rounded-[50px] bg-purple-500 p-2 text-white">add age</a>
<a href="/listing" class="m-2 rounded-[50px] bg-purple-500 p-2 text-white">listing</a>

{@render children()}
