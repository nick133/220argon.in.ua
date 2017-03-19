import './index.styl';


// import Inferno from 'inferno';
// import Axios   from 'axios';
//
// import Advantages from './components/Advantages';
// import Services   from './components/Services';
// import Related    from './components/Related';
//
/*
 *  Hotfix browser related shit
 */
// function browserHotfix() {
//   var isIE =
//     !!navigator.userAgent.match(/Trident/g) ||
//     !!navigator.userAgent.match(/MSIE/g) ||
//     !!navigator.userAgent.match(/Microsoft Internet Explorer/g);
//   // var isChrome = !!window.chrome;
//   // var isOpera = window.onoperadetachedviewcontrol !== undefined;
//
//   // You use IE. That´s no good.
//   if (isIE) {
//     var priceTag = document.getElementById('price-tag');
//     priceTag.style.right = '-100px';
//   }
// }
//
// function parseUrlSearch() {
//   let parsed = {};
//
//   window.location.search.substr(1).split('&').map(function(i) {
//     let data = i.split('=');
//     parsed[data[0]] = data[1];
//     return null;
//   });
//
//   return parsed;
// };

[ 'alu' ].forEach(id => {
  let link  = document.getElementsByClassName('js-link-'  + id)[0];
  let popup = document.getElementsByClassName('js-popup-' + id)[0];

  link.addEventListener('click', () => {
    popup.style.display = 'block';
    popup.style.opacity = 1;
  });
  popup.addEventListener('click', () => {
    popup.style.display = 'none';
    popup.style.opacity = 0;
  });
});


/**
 *  Set animation
 */

const elemPhone     = document.getElementById('phone'),
      elemPhoneLink = document.getElementsByClassName('phone')[0],
      elemPrice  = document.getElementById('price-tag'),
      elemWelder = document.getElementById('banner-welder');

const classPrice  = elemPrice.className,
      classWelder = elemWelder.className;

/* -------- OnScroll phone animation -------- */
const initPhone = {
  className: elemPhone.className,
  color:     elemPhoneLink.style.color,
};

elemPhone.addEventListener('animationend', () => {
  elemPhone.className = initPhone.className;
  elemPhoneLink.style.color = initPhone.color;
});

document.addEventListener('wheel', () => {
  elemPhoneLink.style.color = '#cc0000';
  elemPhone.className += '  animated  tada';
});

/* -------- Price tag animation -------- */
elemPrice.addEventListener('animationend',  () => elemPrice.className  = classPrice);

const animatePrice = () => elemPrice.className += '  animate-price';

elemPrice.addEventListener('click', animatePrice);

animatePrice();
setInterval(animatePrice, 5000);

/* -------- Banner welder animation -------- */
elemWelder.addEventListener('animationend', () => elemWelder.className = classWelder);

elemWelder.addEventListener('click', () => elemWelder.className += '  animate-welder');



// Axios.get(document.getElementById('host-data').src)
//   .then(response => {
//     let uSearch = parseUrlSearch();
//     browserHotfix();
//   })
//   .catch(error => console.log(error));
