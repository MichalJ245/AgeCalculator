<script lang="ts">
    import {getData} from '$lib/Components/getData';
    import {store} from '$lib/Components/store';
	import {returnSVG} from '$lib/Components/returnSVG';
const tableHeaderStyle = 'bg-gray-200 text-xl p-2';
const rowHoverStyle =
		'hover:bg-gray-100 transition-colors duration-1000 dark:hover:bg-gray-700 hover:cursor-pointer p-10';
        const tableStyle =
		'border-b-[1px] border-gray-300 p-2 dark:border-white dark:text-white transition-colors duration-1000 border-collapse text-center p-5 text-2xl font-semibold';
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
		$store.order = field;
		//updateURL();
		getData();
	}
</script>
<table class="my-2">
			<thead>
				<tr>
					<th
						onclick={() => {
							$store.order == 'id' ? orderBy('-id') : orderBy('id');
						}}
						class={tableHeaderStyle}
						>ID&nbsp;{@html returnSVG('arrowTopDown')}</th
					>
					<th
						onclick={() => {
							$store.order == 'name' ? orderBy('-name') : orderBy('name');
						}}
						class={tableHeaderStyle}
						>Name&nbsp;{@html returnSVG('arrowTopDown')}
					</th>
					<th
						onclick={() => {
							$store.order == 'email' ? orderBy('-email') : orderBy('email');
						}}
						class={tableHeaderStyle}
						>Email&nbsp;{@html returnSVG('arrowTopDown')}
					</th>
					<th
						onclick={() => {
							$store.order == 'birthdate' ? orderBy('-birthdate') : orderBy('birthdate');
						}}
						class={tableHeaderStyle}
						>Birthdate&nbsp;{@html returnSVG('arrowTopDown')}
					</th>
					<th
						onclick={() => {
							$store.order == 'city' ? orderBy('-city') : orderBy('city');
						}}
						class={tableHeaderStyle}
						>City&nbsp;{@html returnSVG('arrowTopDown')}
					</th>
				</tr>
			</thead>
			<tbody>
				{#each $store.listOfItems as item}
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