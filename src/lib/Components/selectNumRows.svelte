<script lang='ts'>
    import {store} from '$lib/Components/store';
    import {getData} from '$lib/Components/getData';
    import {updateURL} from '$lib/Components/updateURL';
    function sizeChange() {
		let handler = document.getElementById('size') as HTMLSelectElement;
		$store.size = parseInt(handler.value);
		$store.page = 1;
		updateURL();
		getData();
	}
</script>


<select
				id="size"
				onchange={sizeChange}
				class="m-auto w-64 rounded-[5px] border-1 p-2 hover:cursor-pointer dark:bg-gray-800 dark:text-white"
			>
				<option value="1">Show 1 row</option>
				{#if $store.dataCount >= 2}<option value="2">Show 2 rows</option>{/if}
				{#if $store.dataCount >= 3}<option value="3">Show 3 rows</option>{/if}
				{#if $store.dataCount >= 4}<option value="4">Show 4 rows</option>{/if}
				{#if $store.dataCount >= 5}<option value="5">Show 5 rows</option>{/if}
				{#if $store.dataCount >= 10}<option value="10">Show 10 rows</option>{/if}
				{#if $store.dataCount >= 15}<option value="15">Show 15 rows</option>{/if}
				{#if $store.dataCount >= 20}<option value="20">Show 20 rows</option>{/if}
				{#if $store.dataCount >= 25}<option value="25">Show 25 rows</option>{/if}
				<option value={$store.dataCount} id="all">Show all rows</option>
			</select>