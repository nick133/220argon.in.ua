import Inferno from 'inferno';
import Axios   from 'axios';

import Advantages from './Advantages-com/Advantages';
import Services   from './Services-com/Services';
import Related    from './Related-com/Related';

import * as Host from './hostlib.js';

import './index.css';


/*
 *  Fix some IE shit
 */
var isIE =
  !!navigator.userAgent.match(/Trident/g) ||
  !!navigator.userAgent.match(/MSIE/g) ||
  !!navigator.userAgent.match(/Microsoft Internet Explorer/g);

// You use IE. That´s no good.
if (isIE) {
  var priceTag = document.getElementById('price-tag');
  priceTag.style.right = '-100px';
}

 
Axios.get(document.getElementById('host-data').src)
  .then(response => {
    let uSearch = Host.parseUrlSearch();

    [ [ 'com-advantages', <Advantages data={ response.data.blocks.advantages } /> ],

      [ 'com-services', <Services
          openId={ (uSearch.go !== undefined && uSearch.go.length > 1) ? uSearch.go : '' }
          data={ response.data.blocks.services }
        /> ],

      [ 'com-related', <Related data={ response.data.blocks.related } /> ],

    ].forEach( component => Inferno.render(component[1], document.getElementById(component[0])) );


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

