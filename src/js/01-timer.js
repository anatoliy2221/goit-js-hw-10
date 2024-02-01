import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dateTimePicker = document.querySelector('#datetime-picker');
const btnStart = document.querySelector('[data-start]');
btnStart.disabled = true;
let userSelectedDate;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const selectedDate = selectedDates[0].getTime();

    if (selectedDate < Date.now()) {
      iziToast.error({
        title: 'Error',
        position: 'topCenter',
        message: 'Please choose a date in the future',
      });
      btnStart.disabled = true;
    }
    else {
      btnStart.disabled = false;
      userSelectedDate = selectedDate;
    }
  },
};

flatpickr(dateTimePicker, options);

btnStart.addEventListener('click', startTimer);

function startTimer() {
  const startTime = userSelectedDate;
  const interval = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = startTime - currentTime;

    if (deltaTime <= 0) {
      clearInterval(interval);
    }
    else {
      const { days, hours, minutes, seconds } = convertMs(deltaTime);
      document.querySelector('[data-days]').textContent = `${days}`;
      document.querySelector('[data-hours]').textContent = `${hours}`;
      document.querySelector('[data-minutes]').textContent = `${minutes}`;
      document.querySelector('[data-seconds]').textContent = `${seconds}`;
    }
    document.getElementById('datetime-picker').disabled = true;
    btnStart.disabled = true;
  }, 1000);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const days = addLeadingZero(Math.floor(ms / day));
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
