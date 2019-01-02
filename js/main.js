window.addEventListener('DOMContentLoaded', function() {

	'use strict';

	// Tabs
	let tab = document.querySelectorAll('.info-header-tab'),
			info = document.querySelector('.info-header'),
			tabContent = document.querySelectorAll('.info-tabcontent'),
			descrBtn = document.querySelectorAll('.description-btn');

	function hideTabContent(a) {
		for (let i = a; i < tabContent.length; i++ ) {
			tabContent[i].classList.remove('show');
			tabContent[i].classList.add('hide');
		}
	}

	hideTabContent(1);

	function showTabContent(b) {
		if (tabContent[b].classList.contains('hide')) {
			tabContent[b].classList.remove('hide');
			tabContent[b].classList.add('show');
		}
	}

	info.addEventListener('click', function(e) {
		let target = event.target;
	
		if (target && target.classList.contains('info-header-tab')) {
			for (let i = 0; i < tab.length; i++) {
				if(target == tab[i]) {
					hideTabContent(0);
					showTabContent(i);
					break;
				}
			}
		}

		descrBtn.forEach(function(item) {
			item.addEventListener('click', function() {
				overlay.style.display = 'block';
				this.classList.add('more-splash');
				document.body.style.overflow = 'hidden';
			});
		});
	});

	// Timer
	let deadline = '2018-12-31 ';

	function getTime(endtime) {
		let t = Date.parse(endtime) - Date.parse(new Date()), // Дата в милисикундах
				seconds = Math.floor((t / 1000) % 60),
				minutes = Math.floor((t / 1000 / 60) % 60),
				hours = Math.floor((t / (1000 * 60 * 60)));
				// days = Math.floor((t / (1000 * 60 * 60 * 24)));

		return {
			'total': t,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds
		};
	}

	function setClock(id, endtime) {
		let timer = document.getElementById(id),
				hours = timer.querySelector('.hours'),
				minutes = timer.querySelector('.minutes'),
				seconds = timer.querySelector('.seconds'),
				timeInterval = setInterval(updateClock, 1000);

		function updateClock() {
			let t = getTime(endtime);

			function addZero(num) {
				if(num <= 9) {
					return '0' + num;
				} else return num;
			};

			hours.textContent = addZero(t.hours);
			minutes.textContent = addZero(t.minutes);
			seconds.textContent = addZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
				hours.textContent = '00';
				minutes.textContent = '00';
				seconds.textContent = '00';
			}
		}
	}

	setClock('timer', deadline);

	// Modal
	let more = document.querySelector('.more'),
			overlay = document.querySelector('.overlay'),
			close = document.querySelector('.popup-close');

	more.addEventListener('click', function() {
		overlay.style.display = "block";
		this.classList.add('more-spalsh');
		document.body.style.overflow = 'hidden';
	});

	close.addEventListener('click', function() {
		overlay.style.display = "none";
		more.classList.remove('more-spalsh');
		document.body.style.overflow = '';
	});

	// Form modal
	let message = {
		loading: 'Загрузка...',
		success: 'Спасибо! Скоро мы с вами свяжемся!',
		failure: 'Что-то пошло не так...'
	};

	let form = document.querySelector('.main-form'),
		input = form.getElementsByTagName('input'),
		statusMessage = document.createElement('div');

		statusMessage.classList.add('status');

	form.addEventListener('submit', function(event) {
		event.preventDefault();
		form.appendChild(statusMessage);

		let request = new XMLHttpRequest();
		request.open('POST', 'server.php');
		request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

		let formData = new FormData(form);

		let obj = {};
		formData.forEach(function(value, key) {
				obj[key] = value;
		});
		let json = JSON.stringify(obj);

		request.send(json);

		request.addEventListener('readystatechange', function() {
				if (request.readyState < 4) {
						statusMessage.innerHTML = message.loading;
				} else if(request.readyState === 4 && request.status == 200) {
						statusMessage.innerHTML = message.success;
				} else {
						statusMessage.innerHTML = message.failure;
				}
		});

		for (let i = 0; i < input.length; i++) {
				input[i].value = '';
		}
	});

	// Feedback form
	let feedbackForm = document.getElementById('form');

	feedbackForm.addEventListener('submit', function(event) {
		event.preventDefault();
		feedbackForm.appendChild(statusMessage);

		let input = feedbackForm.querySelectorAll('input');
		let request = new XMLHttpRequest();

		request.open('POST', './server.php');
		request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

		let formData = new FormData(feedbackForm);
		let obj = {};

		formData.forEach(function(value, key) {
			obj[key] = value;
		});

		let data = JSON.stringify(obj);

		request.send(data);

		request.addEventListener('readystatechange', function() {
			if (request.readyState < 4) {
					statusMessage.innerHTML = message.loading;
			} else if(request.readyState === 4 && request.status == 200) {
					statusMessage.innerHTML = message.success;
			} else {
					statusMessage.innerHTML = message.failure;
			}
		});

		input.forEach(function(item) {
			item.value = '';
		});
	});

	// Slider
	let slideIndex = 1,  // Слайд в текущий момент
			slides = document.querySelectorAll('.slider-item'),
			arrowPrev = document.querySelector('.prev'),
			arrowNext = document.querySelector('.next'),
			dotsWrap = document.querySelector('.slider-dots'),
			dots = document.querySelectorAll('.dot');

	showSlides(slideIndex);

	function showSlides(n) {
		if (n > slides.length) {
			slideIndex = 1;
		} if (n < 1) {
			slideIndex = slides.length;
		}

		slides.forEach((item) => { // Перебор всех слайдов
			item.style.display = 'none'; // Скрыть все слайды
		});

		dots.forEach((item) => { // Перебор всех точек 
			item.classList.remove('dot-active'); // Убрать активный класс у всех точек
		})

		slides[slideIndex - 1].style.display = 'block'; // Показать первый слайд
		dots[slideIndex -1].classList.add('dot-active');
	}

	function nextSlides(n) { // Смена слайдов
		showSlides(slideIndex += n);
	}

	function currentSlide(n) {
		showSlides(slideIndex = n);
	}

	arrowPrev.addEventListener('click', function() {
		nextSlides(-1);
	});

	arrowNext.addEventListener('click', function() {
		nextSlides(1);
	})

	dotsWrap.addEventListener('click', function(event) {
		for (let i = 0; i < dots.length + 1; i++ ) {
			if (event.target.classList.contains('dot') && event.target == dots[i - 1]) {
				currentSlide(i);
			}
		}
	});

	// Сalculator
	let persons = document.querySelectorAll('.counter-block-input')[0];
	let restDays = document.querySelectorAll('.counter-block-input')[1];
	let place = document.getElementById('select');
	let totalValue = document.getElementById('total');
	let personSumm = 0,
			daysSumm = 0,
			total = 0;

	totalValue.textContent = 0;

	persons.addEventListener('change', function() {
		personSumm = Number(this.value);
		total = (daysSumm + personSumm) * 4000;
		
		if (restDays.value == '') {
			totalValue.textContent = 0;
		} else if (personSumm == 0) {
			totalValue.textContent = 0;
		} else { 
			totalValue.textContent = total;
		}
	});

	restDays.addEventListener('change', function() {
		daysSumm = Number(this.value);
		total = (daysSumm + personSumm) * 4000;

		if (persons.value == '') {
			totalValue.textContent = 0;
		} else if (daysSumm == 0) {
			totalValue.textContent = 0; 
		} else {
			totalValue.textContent = total;
		}
	});

	place.addEventListener('change', function() {
		if (restDays.value == '' || persons.value == '') {
			totalValue.textContent = 0;
		} else {
			let a = total;
			totalValue.textContent = a * this.options[this.selectedIndex].value;
		}
	});
});