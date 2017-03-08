import Inferno from 'inferno';
import Axios   from 'axios';

import Advantages from './components/Advantages';
import Services   from './components/Services';
import Related    from './components/Related';

import './index.styl';


/*
 *  Hotfix browser related shit
 */
function browserHotfix() {
  var isIE =
    !!navigator.userAgent.match(/Trident/g) ||
    !!navigator.userAgent.match(/MSIE/g) ||
    !!navigator.userAgent.match(/Microsoft Internet Explorer/g);
  // var isChrome = !!window.chrome;
  // var isOpera = window.onoperadetachedviewcontrol !== undefined;
  
  // You use IE. That´s no good.
  if (isIE) {
    var priceTag = document.getElementById('price-tag');
    priceTag.style.right = '-100px';
  }
}

function parseUrlSearch() {
  let parsed = {};

  window.location.search.substr(1).split('&').map(function(i) {
    let data = i.split('=');
    parsed[data[0]] = data[1];
    return null;
  });

  return parsed;
};
 

Axios.get(document.getElementById('host-data').src)
  .then(response => {
    let uSearch = parseUrlSearch();
    let scroll = -18 - window
      .getComputedStyle(document.getElementsByClassName('main-header')[0], null)
      .getPropertyValue('height')
      .replace('px', '');

    [ [ 'com-advantages', <Advantages data={ response.data.blocks.advantages } /> ],

      [ 'com-services', <Services
          openId={ (uSearch.go !== undefined && uSearch.go.length > 1) ? uSearch.go : '' }
          data={ response.data.blocks.services }
          scroll={ scroll }
        /> ],

      [ 'com-related', <Related data={ response.data.blocks.related } /> ],

    ].forEach( component => Inferno.render(component[1], document.getElementById(component[0])) );

    browserHotfix();


    /* ---- Map marker icon animation ---- */

    let locateIcon = document.getElementById('locate-icon');
    let prevLocateClass = locateIcon.className;

    let animateIcon = t => {
      locateIcon.className += '  animated  bounce';
      setTimeout(() => { locateIcon.className = prevLocateClass; }, 4000);
    };

    animateIcon();
    setInterval(animateIcon, 10000);
  })
  .catch(error => console.log(error));

