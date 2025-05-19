<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import {
		differenceInYears,
		differenceInMonths,
		differenceInDays,
		format
	} from 'date-fns';
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
	var age: Date;
	let aaa: string;
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
		age = new Date(year, month, day);
		aaa = format(age,"yyyy-MM-dd");
		console.log(aaa+ typeof aaa);
		countedYears = differenceInYears(currentDate, age);
		let help = new Date((year + countedYears),(month-1),day);
		console.log(help);
		countedMonths = differenceInMonths(currentDate, help);
		let help2 = new Date((year+countedYears),(month+countedMonths-1),day);
		console.log(help2);
		countedDays = differenceInDays(currentDate, help2);
	}
	function send(e:any) {
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
	<form class="m-12 grid grid-cols-3 grid-rows-3" method="post" onsubmit={send} autocomplete="off">
		<div>
			<p class="m-2 font-[poppins] font-bold text-gray-500">NAME</p>
			<input
				type="text"
				id="name"
				class="border-1 mx-2 h-12 w-32 rounded-[8px] text-xl font-bold"
			/>
		</div>
		<div>
			<p class="m-2 font-[poppins] font-bold text-gray-500">EMAIL</p>
			<input
				type="email"
				id="email"
				class="border-1 mx-2 h-12 w-32 rounded-[8px] text-xl font-bold"
			/>
		</div>
		<div>
			<p class="m-2 font-[poppins] font-bold text-gray-500">CITY</p>
			<input
				type="text"
				id="city"
				class="border-1 mx-2 h-12 w-32 rounded-[8px] text-xl font-bold"
			/>
		</div>
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
		<div class="col-span-3 flex flex-row items-center">
			<hr class="w-3/4" />
			<button
				type="submit"
				class="justify-content flex h-24 w-24 rounded-[50px] bg-purple-500 hover:bg-black"
			>
				<img src="http://localhost:5173/icon-arrow.svg" alt="arrow" class="m-auto h-14 w-14" />
			</button>
		</div>
	</form>
	<div class="flex flex-row">
		<p class="text-8xl font-extrabold text-purple-500">{countedYears}</p>
		<p class="text-8xl">years</p>
	</div>
	<div class="flex flex-row">
		<p class="text-8xl font-extrabold text-purple-500">{countedMonths}</p>
		<p class="text-8xl">months</p>
	</div>
	<div class="flex flex-row">
		<p class="text-8xl font-extrabold text-purple-500">{countedDays}</p>
		<p class="text-8xl">days</p>
	</div>
</div>
<div class="attribution">
    Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend Mentor</a>. 
    Coded by MichalJ245.
  </div>
