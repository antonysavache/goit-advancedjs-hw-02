// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";

// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

// Элементы интерфейса
const dateTimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

// Переменные для работы таймера
let userSelectedDate = null;
let countdownInterval = null;

// Конфигурация flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    
    if (selectedDate <= new Date()) {
      // Дата в прошлом
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight'
      });
      startButton.disabled = true;
      userSelectedDate = null;
    } else {
      // Валидная дата (в будущем)
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

// Инициализация flatpickr
flatpickr(dateTimePicker, options);

// Функция для конвертации миллисекунд
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Функция для добавления ведущего нуля
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Функция для обновления интерфейса таймера
function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}

// Функция для запуска таймера
function startCountdown() {
  // Деактивируем элементы управления
  startButton.disabled = true;
  dateTimePicker.disabled = true;

  countdownInterval = setInterval(() => {
    const currentTime = new Date();
    const timeLeft = userSelectedDate - currentTime;

    if (timeLeft <= 0) {
      // Таймер достиг нуля
      clearInterval(countdownInterval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      
      // Активируем только инпут для выбора новой даты
      dateTimePicker.disabled = false;
      
      iziToast.success({
        title: 'Time\'s up!',
        message: 'The countdown has finished!',
        position: 'topRight'
      });
      
      return;
    }

    // Обновляем дисплей
    const timeValues = convertMs(timeLeft);
    updateTimerDisplay(timeValues);
  }, 1000);
}

// Обработчик клика на кнопку Start
startButton.addEventListener('click', startCountdown);
