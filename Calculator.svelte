<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	//import arrowDirectory from '/images/icon-arrow.svg';
	let day: number = $state(0);
	let month: number = $state(0);
	let year: number = $state(0);
	let dayError: boolean = $state(false);
	let monthError: boolean = $state(false);
	let yearError: boolean = $state(false);
	var currentDate = new Date();
	var countedYears: number | '--' = $state('--');
	var countedMonths: number | '--' = $state('--');
	var countedDays: number | '--' = $state('--');
	const fieldCorrect = 'border-gray-400';
	const fieldError = 'border-red-400';
	function fieldStyle(error: boolean) {
		return twMerge(
			'border-1 w-32 h-12 rounded-[8px] mx-2 text-xl font-bold',
			error ? fieldError : fieldCorrect
		);
	}
	function dayValidate() {
		let handler = document.getElementById('day') as HTMLInputElement;
		day = parseInt(handler.value);
		if (
			(typeof day === 'number' &&
				(([4, 6, 9, 11].includes(month) && (day > 30 || day < 0)) ||
					([1, 3, 5, 7, 8, 10, 12].includes(month) && (day > 31 || day < 0)) ||
					(month == 2 && day > 29))) ||
			isNaN(day)
		) {
			dayError = true;
		} else {
			dayError = false;
		}
	}
	function monthValidate() {
		let handler = document.getElementById('month') as HTMLInputElement;
		month = parseInt(handler.value);
		if ((typeof month === 'number' && (month < 0 || month > 12)) || isNaN(month)) {
			monthError = true;
		} else {
			monthError = false;
		}
	}
	function yearValidate() {
		let handler = document.getElementById('year') as HTMLInputElement;
		year = parseInt(handler.value);
		if ((typeof year === 'number' && year >= currentDate.getFullYear()) || isNaN(year)) {
			yearError = true;
		} else {
			yearError = false;
		}
	}
	function countAge() {
		monthValidate();
		dayValidate();
		yearValidate();
		if (!dayError && !monthError && !yearError) {
			countedYears = currentDate.getFullYear() - year;
			console.log("countedYears:"+countedYears);
			countedMonths = currentDate.getMonth() - (month-1);
			console.log("countedMonths:"+countedMonths)
			countedDays = currentDate.getDate() - day;
			console.log("countedDays:"+countedDays)
			if (countedDays < 0) {
				countedMonths--;
				let previousMonth = new Date(year, (month-2), 0).getDate();
				console.log(previousMonth)
				countedDays += previousMonth;
				console.log("currentDate:"+currentDate.getDate());
				console.log("countedDays:"+countedDays)
			}
			if (countedMonths < 0) {
				countedYears--;
				countedMonths += 12;
			}
		}
	}
</script>

<div class="m-auto h-full w-1/2">
	<div class="m-12 flex flex-row">
		<div>
			<p class="m-2 font-[poppins] font-bold text-gray-500">DAY</p>
			<input type="text" id="day" class={fieldStyle(dayError)} placeholder="DD" />
		</div>
		<div>
			<p class="m-2 font-[poppins] font-bold text-gray-500">MONTH</p>
			<input type="text" id="month" class={fieldStyle(monthError)} placeholder="MM" />
		</div>
		<div>
			<p class="m-2 font-[poppins] font-bold text-gray-500">YEAR</p>
			<input type="text" id="year" class={fieldStyle(yearError)} placeholder="YYYY" />
		</div>
	</div>
	<div class="flex flex-row items-center">
		<hr class="w-3/4" />
		<button
			class="justify-content flex h-24 w-24 rounded-[50px] bg-purple-500 hover:bg-black"
			onclick={countAge}
		>
			<img src="http://localhost:5173/icon-arrow.svg" alt="arrow" class="m-auto h-14 w-14" />
		</button>
	</div>
	<div class="flex flex-row">
		<p>{countedYears}</p>
		<p>years</p>
	</div>
	<div class="flex flex-row">
		<p>{countedMonths}</p>
		<p>months</p>
	</div>
	<div class="flex flex-row">
		{countedDays}
		<p>days</p>
	</div>
</div>
<!--<div class="attribution">
    Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend Mentor</a>. 
    Coded by Your Name Here.
  </div>-->
