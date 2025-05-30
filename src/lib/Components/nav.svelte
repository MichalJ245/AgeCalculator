<script lang="ts">
    import { twMerge } from 'tailwind-merge';
    import {store} from '$lib/Components/store';
    import {updateURL} from '$lib/Components/updateURL';
    import {getData} from '$lib/Components/getData';
    import {returnSVG} from '$lib/Components/returnSVG';
    import SelectNumRows from '$lib/Components/selectNumRows.svelte';
function buttonNumberStyle(side: boolean) {
		let buttonActive = 'bg-blue-200 dark:text-white dark:bg-blue-400';
		let buttonNotActive = 'text-gray-800 dark:text-white';
		return twMerge(
			'inline-block w-12 p-2 rounded-[20px] my-2 text-xl hover:cursor-pointer',
			side ? buttonActive : buttonNotActive
		);
	}
    function arrowButtons(arg: 'next' | 'prev') {
		if (arg === 'next' && $store.next) {
			$store.page++;
			updateURL();
			getData();
		} else if (arg === 'prev' && $store.prev) {
			$store.page--;
			updateURL();
			getData();
		}
	}
    function buttonArrow(side: boolean) {
		let buttonActive = 'bg-gray-100 dark:text-white dark:bg-gray-900';
		let buttonNotActive = 'text-gray-800 dark:bg-gray-700 dark:text-white';
		return twMerge(
			'inline-block w-auto p-2 rounded-[10px] m-2 text-xl hover:cursor-pointer',
			side ? buttonActive : buttonNotActive
		);
	}
</script>
<div class="flex justify-around">
			<div class="flex justify-between gap-[50px]">
				<button
					class={buttonArrow(true)}
					onclick={() => {
						if ($store.nextLeft) {
							arrowButtons('prev');
						}
					}}
					> {@html returnSVG('arrowLeft')} previous</button
				>
				<div class="flex justify-center">
					{#each $store.buttonArray as btn}
						{#if btn === -1}
							<p class="my-auto text-xl text-gray-500">...</p>
						{:else}
							<button
								class={buttonNumberStyle(btn === $store.page)}
								onclick={() => {
									$store.page = btn;
									updateURL();
									getData();
								}}
								aria-label="button"
							>
								{btn}
							</button>
						{/if}
					{/each}
				</div>
				<button
					class={buttonArrow(true)}
					onclick={() => {
						if ($store.nextRight) {
							arrowButtons('next');
						}
					}}
					>next {@html returnSVG('arrowRight')}</button
				>
				<SelectNumRows />
			</div>
		</div>