<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { scale } from 'svelte/transition';
	let listOfItems: Array<{
		id: number;
		name: string;
		email: string;
		city: string | null;
		birthdate: string;
	}> = $state([]);
	var jsonFile: any;
	let next: any = $state();
	let previous: any = $state();
	let page: number = $state(1);
	let size: number = $state(1);
	let dataCount: number = $state(1);
	let buttonArray: Array<number> = $state([]);
	let loading = $state(true);
	let index = 0;
	let order:
		| 'id'
		| 'name'
		| 'email'
		| 'birthdate'
		| 'city'
		| '-id'
		| '-name'
		| '-email'
		| '-birthdate'
		| '-city'
		| string = $state('id');
	let name: string = $state('');
	let email: string = $state('');
	let filterVisible: boolean = $state(false);
	const tableStyle =
		'border-b-[1px] border-gray-300 p-2 dark:border-white dark:text-white transition-colors duration-1000 border-collapse text-center p-5 text-2xl font-semibold';
	const tableHeaderStyle = 'bg-gray-200 text-xl p-2';
	const rowHoverStyle =
		'hover:bg-gray-100 transition-colors duration-1000 dark:hover:bg-gray-700 hover:cursor-pointer p-10';
	const orderValues = [
		'id',
		'name',
		'email',
		'birthdate',
		'city',
		'-id',
		'-name',
		'-email',
		'-birthdate',
		'-city'
	];
	const getData = async () => {
		try {
			loading = true;
			loadAnimate();
			const r1 = await fetch(`http://192.168.0.216:8000/users/api/submissions/?page=1&page_size=1`);
			jsonFile = await r1.json();
			dataCount = jsonFile.count;
			if (size > dataCount || Number.isNaN(size) || size < 1) {
				size = dataCount;
			}
			if (page > Math.ceil(dataCount / size) || Number.isNaN(page) || page < 1) {
				page = 1;
			}
			if (!orderValues.includes(order)) {
				order = 'id';
			}
			let response;
			if (name === '' && email ==='') {
				response = await fetch(
					`http://192.168.0.216:8000/users/api/submissions/?&ordering=${order}&page=${page}&page_size=${size}`
				);
			} else if (email === '') {
				response = await fetch(
					`http://192.168.0.216:8000/users/api/submissions/?name=${name}&ordering=${order}&page=${page}&page_size=${size}`
				);
			} else {
				response = await fetch(
					`http://192.168.0.216:8000/users/api/submissions/?email=${email}&ordering=${order}&page=${page}&page_size=${size}`
				);
			}
			jsonFile = await response.json();
			listOfItems = jsonFile.results;
			next = jsonFile.next;
			next ? (nextRight = true) : (nextRight = false);
			previous = jsonFile.previous;
			previous ? (nextLeft = true) : (nextLeft = false);
			dataCount = jsonFile.count;
			buttonNumber();
			loading = false;
			index = 0;
		} catch (e) {
			console.log(e);
		}
	};
	function updateURL() {
		let param = `ordering=${order}&page=${page}&page_size=${size}`;
		goto(`?${param}`);
	}
	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		order = String(params.get('ordering') || 'id');
		page = parseInt(params.get('page') || '1');
		size = parseInt(params.get('page_size') || '1');
		updateURL();
		getData();
	});
	let nextRight: boolean = $state(true);
	let nextLeft: boolean = $state(false);
	function arrowButtons(arg: 'next' | 'prev') {
		if (arg === 'next' && next) {
			page++;
			updateURL();
			getData();
		} else if (arg === 'prev' && previous) {
			page--;
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
	function buttonNumberStyle(side: boolean) {
		let buttonActive = 'bg-blue-200 dark:text-white dark:bg-blue-400';
		let buttonNotActive = 'text-gray-800 dark:text-white';
		return twMerge(
			'inline-block w-12 p-2 rounded-[20px] my-2 text-xl hover:cursor-pointer',
			side ? buttonActive : buttonNotActive
		);
	}

	function orderBy(
		field:
			| 'id'
			| 'name'
			| 'email'
			| 'birthdate'
			| 'city'
			| '-id'
			| '-name'
			| '-email'
			| '-birthdate'
			| '-city'
	) {
		order = field;
		updateURL();
		getData();
	}
	function buttonNumber() {
		let startPage: number = Math.max(1, page - 1);
		let endPage: number = page + 1;
		buttonArray = [];
		let numOfButtons = Math.ceil(dataCount / size);
		let i = 1;
		if (numOfButtons <= 5) {
			for (i = 1; i <= numOfButtons; i++) {
				buttonArray.push(i);
			}
		} else {
			for (i = startPage; i <= endPage; i++) {
				buttonArray.push(i);
			}
			if (endPage < numOfButtons - 1) {
				buttonArray.push(-1);
			}
		}
		if (!buttonArray.includes(numOfButtons)) {
			buttonArray.push(numOfButtons);
		}
		if (buttonArray.includes(numOfButtons + 1)) {
			buttonArray.pop();
		}
	}
	function sizeChange() {
		let handler = document.getElementById('size') as HTMLSelectElement;
		size = parseInt(handler.value);
		page = 1;
		updateURL();
		getData();
	}
	function loadAnimate() {
		if (loading && document.getElementById('load')) {
			let handler = document.getElementById('load') as HTMLDivElement;
			switch (index) {
				case 0:
					handler.innerHTML = 'loading.';
					break;
				case 1:
					handler.innerHTML = 'loading..';
					break;
				case 2:
					handler.innerHTML = 'loading...';
					break;
			}
			if (index <= 1) {
				index++;
			} else {
				index = 0;
			}
			setTimeout(() => requestAnimationFrame(loadAnimate), 500);
		} else if (loading) {
			setTimeout(() => requestAnimationFrame(loadAnimate), 500);
		}
	}
	function getParams() {
		let nameHandler = document.getElementById('name') as HTMLInputElement;
		let emailHandler = document.getElementById('email') as HTMLInputElement;
		name = nameHandler.value;
		email = emailHandler.value;
		console.log('name: '+name)
		console.log('email: '+email)
		getData();
	}
	function filterToggle()
	{
		filterVisible = !filterVisible;
	}
</script>

<div
	class="m-4 flex flex-col justify-center rounded-[10px] bg-white py-4 outline-6 outline-gray-300 transition-colors duration-1000 dark:bg-gray-900 dark:outline-gray-700"
>
	{#if loading}
		<p class="text-center text-3xl dark:text-white" id="load">loading</p>
	{:else if listOfItems.length > 0}
		<div class="relative">
			<button
			aria-label="button"
			class="ml-[90%]"
			onclick={filterToggle}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="icon icon-tabler icons-tabler-outline icon-tabler-filter dark:text-white"
					><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
						d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z"
					/></svg
				></button
			>
			{#if filterVisible}
			<form autocomplete="off" id="form" class="absolute bg-white w-auto ml-[60%] dark:bg-gray-900 grid grid-cols-2 transition-colors border-1 p-2 rounded-[10px] dark:border-gray-700 duration-1000" transition:scale>
				<label
					for="name"
					class="m-2 inline text-2xl transition-colors duration-1000 dark:text-white"
					>Find in names:</label
				>
				<input
					type="text"
					id="name"
					class="m-2 inline w-auto rounded-[10px] border-1 p-2 text-xl transition-colors duration-1000 dark:border-white dark:text-white"
				/>
				<label
					for="email"
					class="m-2 inline text-2xl transition-colors duration-1000 dark:text-white"
					>Find in emails:</label
				>
				<input
					type="text"
					id="email"
					class="m-2 inline w-auto rounded-[10px] border-1 p-2 text-xl transition-colors duration-1000 dark:border-white dark:text-white"
				/>
				<input
					type="button"
					onclick={() => {filterToggle();getParams()}}
					class="h-12 w-24 rounded-[10px] bg-purple-500 text-xl font-semibold text-white dark:bg-purple-600transition-colors duration-1000 hover:cursor-pointer"
					value="apply"
				/>
			</form>
			{/if}
		</div>
		<table class="my-2">
			<thead>
				<tr>
					<th
						onclick={() => {
							order == 'id' ? orderBy('-id') : orderBy('id');
						}}
						class={tableHeaderStyle}
						>ID&nbsp;<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="icon icon-tabler icons-tabler-filled icon-tabler-caret-up-down inline"
							><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
								d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6a.95 .95 0 0 1 .073 .082l.006 .008l.016 .022l.042 .059l.009 .015l.007 .01l.014 .027l.024 .044l.007 .017l.01 .02l.012 .032l.015 .034l.007 .025l.008 .02l.005 .026l.012 .037l.004 .028l.006 .025l.003 .026l.006 .033l.002 .03l.003 .028v.026l.002 .033l-.002 .033v.026l-.003 .026l-.002 .032l-.005 .029l-.004 .03l-.006 .024l-.004 .03l-.012 .035l-.005 .027l-.008 .019l-.007 .026l-.015 .033l-.012 .034l-.01 .018l-.007 .018l-.024 .043l-.014 .028l-.007 .009l-.009 .016l-.042 .058l-.012 .019l-.004 .003l-.006 .01a1.006 1.006 0 0 1 -.155 .154l-.009 .006l-.022 .016l-.058 .042l-.016 .009l-.009 .007l-.028 .014l-.043 .024l-.018 .007l-.018 .01l-.034 .012l-.033 .015l-.024 .006l-.021 .009l-.027 .005l-.036 .012l-.029 .004l-.024 .006l-.028 .003l-.031 .006l-.032 .002l-.026 .003h-.026l-.033 .002h-12c-.89 0 -1.337 -1.077 -.707 -1.707l6 -6z"
							/><path
								d="M18 13l.033 .002h.026l.026 .003l.032 .002l.031 .006l.028 .003l.024 .006l.03 .004l.035 .012l.027 .005l.019 .008l.026 .007l.033 .015l.034 .012l.018 .01l.018 .007l.043 .024l.028 .014l.009 .007l.016 .009l.051 .037l.026 .017l.003 .004l.01 .006a.982 .982 0 0 1 .154 .155l.006 .009l.015 .02l.043 .06l.009 .016l.007 .009l.014 .028l.024 .043l.005 .013l.012 .023l.012 .034l.015 .033l.007 .026l.008 .02l.005 .026l.012 .036l.004 .029l.006 .024l.003 .028l.006 .031l.002 .032l.003 .026v.026l.002 .033l-.002 .033v.026l-.003 .026l-.002 .032l-.006 .031l-.003 .028l-.006 .024l-.004 .03l-.012 .035l-.005 .027l-.008 .019l-.007 .026l-.015 .033l-.012 .034l-.01 .018l-.007 .018l-.024 .043l-.014 .028l-.007 .009l-.009 .016l-.042 .058l-.012 .019l-.004 .003l-.006 .01l-.073 .081l-6 6a1 1 0 0 1 -1.414 0l-6 -6c-.63 -.63 -.184 -1.707 .707 -1.707h12z"
							/></svg
						></th
					>
					<th
						onclick={() => {
							order == 'name' ? orderBy('-name') : orderBy('name');
						}}
						class={tableHeaderStyle}
						>Name&nbsp;<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="icon icon-tabler icons-tabler-filled icon-tabler-caret-up-down inline"
							><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
								d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6a.95 .95 0 0 1 .073 .082l.006 .008l.016 .022l.042 .059l.009 .015l.007 .01l.014 .027l.024 .044l.007 .017l.01 .02l.012 .032l.015 .034l.007 .025l.008 .02l.005 .026l.012 .037l.004 .028l.006 .025l.003 .026l.006 .033l.002 .03l.003 .028v.026l.002 .033l-.002 .033v.026l-.003 .026l-.002 .032l-.005 .029l-.004 .03l-.006 .024l-.004 .03l-.012 .035l-.005 .027l-.008 .019l-.007 .026l-.015 .033l-.012 .034l-.01 .018l-.007 .018l-.024 .043l-.014 .028l-.007 .009l-.009 .016l-.042 .058l-.012 .019l-.004 .003l-.006 .01a1.006 1.006 0 0 1 -.155 .154l-.009 .006l-.022 .016l-.058 .042l-.016 .009l-.009 .007l-.028 .014l-.043 .024l-.018 .007l-.018 .01l-.034 .012l-.033 .015l-.024 .006l-.021 .009l-.027 .005l-.036 .012l-.029 .004l-.024 .006l-.028 .003l-.031 .006l-.032 .002l-.026 .003h-.026l-.033 .002h-12c-.89 0 -1.337 -1.077 -.707 -1.707l6 -6z"
							/><path
								d="M18 13l.033 .002h.026l.026 .003l.032 .002l.031 .006l.028 .003l.024 .006l.03 .004l.035 .012l.027 .005l.019 .008l.026 .007l.033 .015l.034 .012l.018 .01l.018 .007l.043 .024l.028 .014l.009 .007l.016 .009l.051 .037l.026 .017l.003 .004l.01 .006a.982 .982 0 0 1 .154 .155l.006 .009l.015 .02l.043 .06l.009 .016l.007 .009l.014 .028l.024 .043l.005 .013l.012 .023l.012 .034l.015 .033l.007 .026l.008 .02l.005 .026l.012 .036l.004 .029l.006 .024l.003 .028l.006 .031l.002 .032l.003 .026v.026l.002 .033l-.002 .033v.026l-.003 .026l-.002 .032l-.006 .031l-.003 .028l-.006 .024l-.004 .03l-.012 .035l-.005 .027l-.008 .019l-.007 .026l-.015 .033l-.012 .034l-.01 .018l-.007 .018l-.024 .043l-.014 .028l-.007 .009l-.009 .016l-.042 .058l-.012 .019l-.004 .003l-.006 .01l-.073 .081l-6 6a1 1 0 0 1 -1.414 0l-6 -6c-.63 -.63 -.184 -1.707 .707 -1.707h12z"
							/></svg
						>
					</th>
					<th
						onclick={() => {
							order == 'email' ? orderBy('-email') : orderBy('email');
						}}
						class={tableHeaderStyle}
						>Email&nbsp;<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="icon icon-tabler icons-tabler-filled icon-tabler-caret-up-down inline"
							><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
								d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6a.95 .95 0 0 1 .073 .082l.006 .008l.016 .022l.042 .059l.009 .015l.007 .01l.014 .027l.024 .044l.007 .017l.01 .02l.012 .032l.015 .034l.007 .025l.008 .02l.005 .026l.012 .037l.004 .028l.006 .025l.003 .026l.006 .033l.002 .03l.003 .028v.026l.002 .033l-.002 .033v.026l-.003 .026l-.002 .032l-.005 .029l-.004 .03l-.006 .024l-.004 .03l-.012 .035l-.005 .027l-.008 .019l-.007 .026l-.015 .033l-.012 .034l-.01 .018l-.007 .018l-.024 .043l-.014 .028l-.007 .009l-.009 .016l-.042 .058l-.012 .019l-.004 .003l-.006 .01a1.006 1.006 0 0 1 -.155 .154l-.009 .006l-.022 .016l-.058 .042l-.016 .009l-.009 .007l-.028 .014l-.043 .024l-.018 .007l-.018 .01l-.034 .012l-.033 .015l-.024 .006l-.021 .009l-.027 .005l-.036 .012l-.029 .004l-.024 .006l-.028 .003l-.031 .006l-.032 .002l-.026 .003h-.026l-.033 .002h-12c-.89 0 -1.337 -1.077 -.707 -1.707l6 -6z"
							/><path
								d="M18 13l.033 .002h.026l.026 .003l.032 .002l.031 .006l.028 .003l.024 .006l.03 .004l.035 .012l.027 .005l.019 .008l.026 .007l.033 .015l.034 .012l.018 .01l.018 .007l.043 .024l.028 .014l.009 .007l.016 .009l.051 .037l.026 .017l.003 .004l.01 .006a.982 .982 0 0 1 .154 .155l.006 .009l.015 .02l.043 .06l.009 .016l.007 .009l.014 .028l.024 .043l.005 .013l.012 .023l.012 .034l.015 .033l.007 .026l.008 .02l.005 .026l.012 .036l.004 .029l.006 .024l.003 .028l.006 .031l.002 .032l.003 .026v.026l.002 .033l-.002 .033v.026l-.003 .026l-.002 .032l-.006 .031l-.003 .028l-.006 .024l-.004 .03l-.012 .035l-.005 .027l-.008 .019l-.007 .026l-.015 .033l-.012 .034l-.01 .018l-.007 .018l-.024 .043l-.014 .028l-.007 .009l-.009 .016l-.042 .058l-.012 .019l-.004 .003l-.006 .01l-.073 .081l-6 6a1 1 0 0 1 -1.414 0l-6 -6c-.63 -.63 -.184 -1.707 .707 -1.707h12z"
							/></svg
						>
					</th>
					<th
						onclick={() => {
							order == 'birthdate' ? orderBy('-birthdate') : orderBy('birthdate');
						}}
						class={tableHeaderStyle}
						>Birthdate&nbsp;<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="icon icon-tabler icons-tabler-filled icon-tabler-caret-up-down inline"
							><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
								d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6a.95 .95 0 0 1 .073 .082l.006 .008l.016 .022l.042 .059l.009 .015l.007 .01l.014 .027l.024 .044l.007 .017l.01 .02l.012 .032l.015 .034l.007 .025l.008 .02l.005 .026l.012 .037l.004 .028l.006 .025l.003 .026l.006 .033l.002 .03l.003 .028v.026l.002 .033l-.002 .033v.026l-.003 .026l-.002 .032l-.005 .029l-.004 .03l-.006 .024l-.004 .03l-.012 .035l-.005 .027l-.008 .019l-.007 .026l-.015 .033l-.012 .034l-.01 .018l-.007 .018l-.024 .043l-.014 .028l-.007 .009l-.009 .016l-.042 .058l-.012 .019l-.004 .003l-.006 .01a1.006 1.006 0 0 1 -.155 .154l-.009 .006l-.022 .016l-.058 .042l-.016 .009l-.009 .007l-.028 .014l-.043 .024l-.018 .007l-.018 .01l-.034 .012l-.033 .015l-.024 .006l-.021 .009l-.027 .005l-.036 .012l-.029 .004l-.024 .006l-.028 .003l-.031 .006l-.032 .002l-.026 .003h-.026l-.033 .002h-12c-.89 0 -1.337 -1.077 -.707 -1.707l6 -6z"
							/><path
								d="M18 13l.033 .002h.026l.026 .003l.032 .002l.031 .006l.028 .003l.024 .006l.03 .004l.035 .012l.027 .005l.019 .008l.026 .007l.033 .015l.034 .012l.018 .01l.018 .007l.043 .024l.028 .014l.009 .007l.016 .009l.051 .037l.026 .017l.003 .004l.01 .006a.982 .982 0 0 1 .154 .155l.006 .009l.015 .02l.043 .06l.009 .016l.007 .009l.014 .028l.024 .043l.005 .013l.012 .023l.012 .034l.015 .033l.007 .026l.008 .02l.005 .026l.012 .036l.004 .029l.006 .024l.003 .028l.006 .031l.002 .032l.003 .026v.026l.002 .033l-.002 .033v.026l-.003 .026l-.002 .032l-.006 .031l-.003 .028l-.006 .024l-.004 .03l-.012 .035l-.005 .027l-.008 .019l-.007 .026l-.015 .033l-.012 .034l-.01 .018l-.007 .018l-.024 .043l-.014 .028l-.007 .009l-.009 .016l-.042 .058l-.012 .019l-.004 .003l-.006 .01l-.073 .081l-6 6a1 1 0 0 1 -1.414 0l-6 -6c-.63 -.63 -.184 -1.707 .707 -1.707h12z"
							/></svg
						>
					</th>
					<th
						onclick={() => {
							order == 'city' ? orderBy('-city') : orderBy('city');
						}}
						class={tableHeaderStyle}
						>City&nbsp;<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="icon icon-tabler icons-tabler-filled icon-tabler-caret-up-down inline"
							><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
								d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6a.95 .95 0 0 1 .073 .082l.006 .008l.016 .022l.042 .059l.009 .015l.007 .01l.014 .027l.024 .044l.007 .017l.01 .02l.012 .032l.015 .034l.007 .025l.008 .02l.005 .026l.012 .037l.004 .028l.006 .025l.003 .026l.006 .033l.002 .03l.003 .028v.026l.002 .033l-.002 .033v.026l-.003 .026l-.002 .032l-.005 .029l-.004 .03l-.006 .024l-.004 .03l-.012 .035l-.005 .027l-.008 .019l-.007 .026l-.015 .033l-.012 .034l-.01 .018l-.007 .018l-.024 .043l-.014 .028l-.007 .009l-.009 .016l-.042 .058l-.012 .019l-.004 .003l-.006 .01a1.006 1.006 0 0 1 -.155 .154l-.009 .006l-.022 .016l-.058 .042l-.016 .009l-.009 .007l-.028 .014l-.043 .024l-.018 .007l-.018 .01l-.034 .012l-.033 .015l-.024 .006l-.021 .009l-.027 .005l-.036 .012l-.029 .004l-.024 .006l-.028 .003l-.031 .006l-.032 .002l-.026 .003h-.026l-.033 .002h-12c-.89 0 -1.337 -1.077 -.707 -1.707l6 -6z"
							/><path
								d="M18 13l.033 .002h.026l.026 .003l.032 .002l.031 .006l.028 .003l.024 .006l.03 .004l.035 .012l.027 .005l.019 .008l.026 .007l.033 .015l.034 .012l.018 .01l.018 .007l.043 .024l.028 .014l.009 .007l.016 .009l.051 .037l.026 .017l.003 .004l.01 .006a.982 .982 0 0 1 .154 .155l.006 .009l.015 .02l.043 .06l.009 .016l.007 .009l.014 .028l.024 .043l.005 .013l.012 .023l.012 .034l.015 .033l.007 .026l.008 .02l.005 .026l.012 .036l.004 .029l.006 .024l.003 .028l.006 .031l.002 .032l.003 .026v.026l.002 .033l-.002 .033v.026l-.003 .026l-.002 .032l-.006 .031l-.003 .028l-.006 .024l-.004 .03l-.012 .035l-.005 .027l-.008 .019l-.007 .026l-.015 .033l-.012 .034l-.01 .018l-.007 .018l-.024 .043l-.014 .028l-.007 .009l-.009 .016l-.042 .058l-.012 .019l-.004 .003l-.006 .01l-.073 .081l-6 6a1 1 0 0 1 -1.414 0l-6 -6c-.63 -.63 -.184 -1.707 .707 -1.707h12z"
							/></svg
						>
					</th>
				</tr>
			</thead>
			<tbody>
				{#each listOfItems as item}
					<tr class={rowHoverStyle}>
						<td class={tableStyle}>{item.id}</td>
						<td class={tableStyle}>{item.name}</td>
						<td class={tableStyle}>{item.email}</td>
						<td class={tableStyle}>{item.birthdate}</td>
						<td class={tableStyle}>{item.city}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="flex justify-around">
			<div class="flex justify-between gap-[50px]">
				<button
					class={buttonArrow(true)}
					onclick={() => {
						if (nextLeft) {
							arrowButtons('prev');
						}
					}}
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="icon icon-tabler icons-tabler-filled icon-tabler-caret-left inline"
						><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
							d="M13.883 5.007l.058 -.005h.118l.058 .005l.06 .009l.052 .01l.108 .032l.067 .027l.132 .07l.09 .065l.081 .073l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059v12c0 .852 -.986 1.297 -1.623 .783l-.084 -.076l-6 -6a1 1 0 0 1 -.083 -1.32l.083 -.094l6 -6l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01z"
						/></svg
					> previous</button
				>
				<div class="flex justify-center">
					{#each buttonArray as btn}
						{#if btn === -1}
							<p class="my-auto text-xl text-gray-500">...</p>
						{:else}
							<button
								class={buttonNumberStyle(btn === page)}
								onclick={() => {
									page = btn;
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
						if (nextRight) {
							arrowButtons('next');
						}
					}}
					>next <svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="icon icon-tabler icons-tabler-filled icon-tabler-caret-right inline"
						><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
							d="M9 6c0 -.852 .986 -1.297 1.623 -.783l.084 .076l6 6a1 1 0 0 1 .083 1.32l-.083 .094l-6 6l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002l-.059 -.002l-.058 -.005l-.06 -.009l-.052 -.01l-.108 -.032l-.067 -.027l-.132 -.07l-.09 -.065l-.081 -.073l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057l-.002 -12.059z"
						/></svg
					></button
				>
			</div>
			<select
				id="size"
				onchange={sizeChange}
				class="m-auto w-64 rounded-[5px] border-1 p-2 hover:cursor-pointer dark:bg-gray-800 dark:text-white"
			>
				<option value="1">Show 1 row</option>
				{#if dataCount >= 2}<option value="2">Show 2 rows</option>{/if}
				{#if dataCount >= 3}<option value="3">Show 3 rows</option>{/if}
				{#if dataCount >= 4}<option value="4">Show 4 rows</option>{/if}
				{#if dataCount >= 5}<option value="5">Show 5 rows</option>{/if}
				{#if dataCount >= 10}<option value="10">Show 10 rows</option>{/if}
				{#if dataCount >= 15}<option value="15">Show 15 rows</option>{/if}
				{#if dataCount >= 20}<option value="20">Show 20 rows</option>{/if}
				{#if dataCount >= 25}<option value="25">Show 25 rows</option>{/if}
				<option value={dataCount} id="all">Show all rows</option>
			</select>
		</div>
		<p class="m-2 transition-colors duration-1000 dark:text-white">
			Showing {listOfItems.length} of {dataCount} results
		</p>
	{:else}
		<p class="dark: text-center text-white transition-colors duration-1000">
			No data, or connection failed
		</p>
	{/if}
</div>
