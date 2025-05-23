<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { differenceInYears, differenceInMonths, differenceInDays, format } from 'date-fns';
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
	const fieldCorrect = 'border-gray-400 dark:text-gray-200 ';
	const fieldError = 'border-red-400 dark:border-red-300 dark:text-gray-200';
	var age: Date;
	let aaa: string;
	function fieldStyle(error: boolean) {
		return twMerge(
			'border-1 w-32 h-12 rounded-[8px] mx-2 text-xl font-bold placeholder:text-gray-500 dark:placeholder:text-gray-200 transition-colors duration-1000 w-[100%]',
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
		age = new Date(year, month, day);
		aaa = format(age, 'yyyy-MM-dd');
		console.log(aaa + typeof aaa);
		countedYears = differenceInYears(currentDate, age);
		let help = new Date(year + countedYears, month - 1, day);
		console.log(help);
		countedMonths = differenceInMonths(currentDate, help);
		let help2 = new Date(year + countedYears, month + countedMonths - 1, day);
		console.log(help2);
		countedDays = differenceInDays(currentDate, help2);
	}
	function send(e: any) {
		e.preventDefault();
		monthValidate();
		dayValidate();
		yearValidate();
		if (!dayError && !monthError && !yearError) {
			countAge();
			let formEmail;
			let handler = document.getElementById('email') as HTMLInputElement;
			formEmail = handler.value;
			let formName;
			handler = document.getElementById('name') as HTMLInputElement;
			formName = handler.value;
			let formCity;
			handler = document.getElementById('city') as HTMLInputElement;
			formCity = handler.value;
			console.log(typeof formEmail);
			console.log(typeof formName);
			console.log(typeof formCity);
			console.log(typeof age);
			fetch('http://192.168.0.216:8000/users/api/submissions/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: formName,
					email: formEmail,
					birthdate: aaa,
					city: formCity
				})
			});
		}
	}
</script>

<div class="m-auto h-full w-1/2 rounded-[20px] rounded-br-[200px]">
	<form class="m-12 grid grid-cols-3 gap-x-2" method="post" onsubmit={send} autocomplete="off">
		<div class="">
			<p
				class="m-2 font-[poppins] font-bold text-gray-500 transition-colors duration-1000 dark:text-gray-300"
			>
				NAME
			</p>
			<input
				type="text"
				id="name"
				class="mx-2 h-12 w-32 w-[100%] rounded-[8px] border-1 text-xl font-bold transition-colors duration-1000 dark:text-gray-200"
			/>
		</div>
		<div class="">
			<p
				class="m-2 font-[poppins] font-bold text-gray-500 transition-colors duration-1000 dark:text-gray-300"
			>
				EMAIL
			</p>
			<input
				type="email"
				id="email"
				class="mx-2 h-12 w-32 w-[100%] rounded-[8px] border-1 text-xl font-bold text-gray-700 transition-colors duration-1000 dark:text-gray-200"
			/>
		</div>
		<div class="">
			<p
				class="m-2 font-[poppins] font-bold text-gray-500 transition-colors duration-1000 dark:text-gray-300"
			>
				CITY
			</p>
			<input
				type="text"
				id="city"
				class="mx-2 h-12 w-32 w-[100%] rounded-[8px] border-1 text-xl font-bold text-gray-700 transition-colors duration-1000 dark:text-gray-200"
			/>
		</div>
		<div class="">
			<p
				class="m-2 font-[poppins] font-bold text-gray-500 transition-colors duration-1000 dark:text-gray-300"
			>
				DAY
			</p>
			<input type="text" id="day" class={fieldStyle(dayError)} placeholder="DD" />
		</div>
		<div class="">
			<p
				class="m-2 font-[poppins] font-bold text-gray-500 transition-colors duration-1000 dark:text-gray-300"
			>
				MONTH
			</p>
			<input type="text" id="month" class={fieldStyle(monthError)} placeholder="MM" />
		</div>
		<div class="">
			<p
				class="m-2 font-[poppins] font-bold text-gray-500 transition-colors duration-1000 dark:text-gray-300"
			>
				YEAR
			</p>
			<input type="text" id="year" class={fieldStyle(yearError)} placeholder="YYYY" />
		</div>
		<div class="relative col-span-3 w-full h-24">
			<hr class="absolute inset-x-0 top-1/2 w-full -translate-y-1/2" />
			<button
				type="submit"
				class="justify-content absolute z-10 flex h-24 w-24 rounded-full bg-purple-500 transition-colors duration-1000 hover:bg-black left-1/2 -translate-x-1/2 transform md:right-0 md:translate-x-0 md:left-auto dark:bg-purple-600 dark:hover:bg-gray-400"
			>
				<img src="icon-arrow.svg" alt="arrow" class="m-auto h-14 w-14" />
			</button>
		</div>
	</form>
	<div class="flex flex-row whitespace-nowrap">
		<p
			class="text-8xl font-extrabold text-purple-500 transition-colors duration-1000 dark:text-purple-600"
		>
			{countedYears}
		</p>
		<p class="text-8xl transition-colors duration-1000 dark:text-gray-200">years</p>
	</div>
	<div class="flex flex-row whitespace-nowrap">
		<p
			class="text-8xl font-extrabold text-purple-500 transition-colors duration-1000 dark:text-purple-600"
		>
			{countedMonths}
		</p>
		<p class="text-8xl transition-colors duration-1000 dark:text-gray-200">months</p>
	</div>
	<div class="flex flex-row whitepsace-nowrap">
		<p
			class="text-8xl font-extrabold text-purple-500 transition-colors duration-1000 dark:text-purple-600"
		>
			{countedDays}
		</p>
		<p class="text-8xl transition-colors duration-1000 dark:text-gray-200">days</p>
	</div>
</div>
<div class="attribution transition-colors duration-1000 dark:text-white">
	Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank"
		>Frontend Mentor</a
	>. Coded by MichalJ245.
</div>
