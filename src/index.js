import './index.styl';

/**
 *  Set animation
 */

const elemMain   = document.getElementsByClassName('js-main')[0],
      elemPhone  = document.getElementsByClassName('js-phone')[0],
      elemPhoneA = document.getElementsByClassName('js-phone-is')[0],
      elemPrice  = document.getElementsByClassName('js-price-tag')[0],
      elemWelder = document.getElementsByClassName('js-banner-welder')[0];

const classPrice  = elemPrice.className,
      classWelder = elemWelder.className,
      classPhone  = elemPhone.className;

/* -------- OnScroll/OnClick phone animation -------- */
const colorPhone = elemPhoneA.style.color;

const setColorPhone = () => {
    elemPhoneA.style.color = '#fb0000';
    setTimeout(() => elemPhoneA.style.color = colorPhone, 800);
};

const animatePhone = () => {
  if (window.screen.width > 600)
    elemPhone.className += '  animated  tada';
  else
    setColorPhone();
};

elemPhone.addEventListener('animationend', () => elemPhone.className = classPhone);
elemMain.addEventListener('click', animatePhone);
document.addEventListener('wheel', animatePhone);

/* -------- Price tag animation -------- */
elemPrice.addEventListener('animationend',  () => elemPrice.className = classPrice);

const animatePrice = () => elemPrice.className += '  animate-price';

elemPrice.addEventListener('click', animatePrice);

animatePrice();
setInterval(animatePrice, 5000);

/* -------- Banner welder animation -------- */
elemWelder.addEventListener('animationend', () => elemWelder.className = classWelder);

elemWelder.addEventListener('click', () => elemWelder.className += '  animate-welder');

