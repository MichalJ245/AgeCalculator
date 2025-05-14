<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	let day: number | 'DD' = $state('DD');
	let month: number | 'MM' = $state('MM');
	let year: number | 'YYYY' = $state('YYYY');
	let dayError: boolean = $state(false);
	let monthError: boolean = $state(false);
	let yearError: boolean = $state(false);
	const fieldCorrect = 'border-black';
	const fieldError = 'border-red-500';
	function fieldStyle(error: boolean) {
		return twMerge('border-1', error ? fieldError : fieldCorrect);
	}

    function dayValidate(){
		if (typeof day === 'number' && (day < 0 || day > 31)) {
			dayError = true;
		} else {
			dayError = false;
		}
	}
</script>

<div class="m-auto h-full w-1/2">
	<input type="text" id="day" class={fieldStyle(dayError)} bind:value={day} />
	<input type="text" id="month" class={fieldStyle(monthError)} bind:value={month} />
	<input type="text" min="0" max="2025" id="year" class={fieldStyle(yearError)} bind:value={year} />
	<hr />
	<div>
		<p>years</p>
	</div>
	<div>
		<p>months</p>
	</div>
	<div>
		<p>days</p>
	</div>
</div>
