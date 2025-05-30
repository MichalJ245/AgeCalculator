<script lang='ts'>
import {storeCalc} from '$lib/Components/storeCalc';
import {validate} from '$lib/Components/validateCalc';
import {PUBLIC_API} from '$env/static/public';
import { differenceInYears, differenceInMonths, differenceInDays, format } from 'date-fns';
import { twMerge } from 'tailwind-merge';
const fieldCorrect = 'border-gray-400 dark:text-gray-200 ';
const fieldError = 'border-red-400 dark:border-red-300 dark:text-gray-200';

let aaa: string;
function countAge() {
		storeCalc.update(value => {
		$storeCalc.age = new Date(value.year, value.month, value.day);
		aaa = format($storeCalc.age, 'yyyy-MM-dd');
		console.log(aaa + typeof aaa);
		value.countedYears = differenceInYears($storeCalc.currentDate, $storeCalc.age);
		let help = new Date(value.year + value.countedYears, value.month - 1, value.day);
		console.log(help);
		value.countedMonths = differenceInMonths($storeCalc.currentDate, help);
		let help2 = new Date(value.year + value.countedYears, value.month + value.countedMonths - 1, value.day);
		console.log(help2);
		value.countedDays = differenceInDays($storeCalc.currentDate, help2);
		return value;
		})
	}
function send(e: any) {
		e.preventDefault();
		validate();
		storeCalc.update(value => {
		if (!value.dayError && !value.monthError && !value.yearError) {
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
			console.log(typeof $storeCalc.age);
			fetch(PUBLIC_API, {
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
		return value;
		})
	}
    function fieldStyle(error: boolean) {
		return twMerge(
			'border-1 w-32 h-12 rounded-[8px] mx-2 text-xl font-bold placeholder:text-gray-500 dark:placeholder:text-gray-200 transition-colors duration-1000 w-[100%]',
			error ? fieldError : fieldCorrect
		);
	}
</script>



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
			<input type="text" id="day" class={fieldStyle($storeCalc.dayError)} placeholder="DD" />
		</div>
		<div class="">
			<p
				class="m-2 font-[poppins] font-bold text-gray-500 transition-colors duration-1000 dark:text-gray-300"
			>
				MONTH
			</p>
			<input type="text" id="month" class={fieldStyle($storeCalc.monthError)} placeholder="MM" />
		</div>
		<div class="">
			<p
				class="m-2 font-[poppins] font-bold text-gray-500 transition-colors duration-1000 dark:text-gray-300"
			>
				YEAR
			</p>
			<input type="text" id="year" class={fieldStyle($storeCalc.yearError)} placeholder="YYYY" />
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