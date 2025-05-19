<script lang="ts">
	import { onMount } from "svelte";
    let listOfItems: Array<{id: number, name: string, email: string, city?: string, birthdate: string}>;
    const getData = async ()=>    {
        const response = await fetch('http://192.168.0.216:8000/users/api/submissions/');

        const json = await response.json();

        listOfItems = json;
        
    }

    onMount(()=>{
        getData();
    })


</script>
<div class="flex flex-col justify-center">
{#if listOfItems}
{#each listOfItems as item}
<div class="w-64 mx-auto bg-gray-300 my-6 p-4 rounded-[30px]">
    <p><span class="text-purple-500 font-bold">ID:</span> {item.id}</p>
    <p><span class="text-purple-500 font-bold">Name:</span> {item.name}</p>
    <p><span class="text-purple-500 font-bold">Email:</span> {item.email}</p>
    {#if item.city}
    <p><span class="text-purple-500 font-bold">City:</span> {item.city}</p>
    {/if}
    <p><span class="text-purple-500 font-bold">Birthdate:</span> {item.birthdate}</p>
</div>
{/each}
{:else}
<p>Brak danych</p>
{/if}
</div>