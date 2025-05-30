<script lang='ts'>
    import {storeCalc} from '$lib/Components/storeCalc';
</script>
<div class="flex flex-row whitespace-nowrap">
		<p
			class="text-8xl font-extrabold text-purple-500 transition-colors duration-1000 dark:text-purple-600"
		>
			{$storeCalc.countedYears}
		</p>
		<p class="text-8xl transition-colors duration-1000 dark:text-gray-200">years</p>
	</div>
	<div class="flex flex-row whitespace-nowrap">
		<p
			class="text-8xl font-extrabold text-purple-500 transition-colors duration-1000 dark:text-purple-600"
		>
			{$storeCalc.countedMonths}
		</p>
		<p class="text-8xl transition-colors duration-1000 dark:text-gray-200">months</p>
	</div>
	<div class="flex flex-row whitepsace-nowrap">
		<p
			class="text-8xl font-extrabold text-purple-500 transition-colors duration-1000 dark:text-purple-600"
		>
			{$storeCalc.countedDays}
		</p>
		<p class="text-8xl transition-colors duration-1000 dark:text-gray-200">days</p>
	</div>