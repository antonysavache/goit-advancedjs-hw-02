// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

// Элемент формы
const form = document.querySelector('.form');

// Функция для создания промиса
function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

// Обработчик отправки формы
function handleFormSubmit(event) {
  event.preventDefault();
  
  // Получаем данные из формы
  const formData = new FormData(event.target);
  const delay = parseInt(formData.get('delay'));
  const state = formData.get('state');
  
  // Создаем и обрабатываем промис
  createPromise(delay, state)
    .then((delay) => {
      // Успешное выполнение
      const message = `✅ Fulfilled promise in ${delay}ms`;
      console.log(message);
      
      iziToast.success({
        title: 'Success',
        message: message,
        position: 'topRight'
      });
    })
    .catch((delay) => {
      // Отклонение промиса
      const message = `❌ Rejected promise in ${delay}ms`;
      console.log(message);
      
      iziToast.error({
        title: 'Error',
        message: message,
        position: 'topRight'
      });
    });
}

// Добавляем обработчик события
form.addEventListener('submit', handleFormSubmit);
