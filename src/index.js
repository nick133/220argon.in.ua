import Inferno from 'inferno';
import Axios   from 'axios';

import Advantages from './Advantages-com/Advantages';
import Services   from './Services-com/Services';
import Related    from './Related-com/Related';

import * as Host from './hostlib.js';

import './index.css';


Axios.get(document.getElementById('host-data').src)
  .then(function (response) {
    let uSearch = Host.parseUrlSearch();

    [ [ 'com-advantages', <Advantages data={ response.data.blocks.advantages } /> ],

      [ 'com-services', <Services
          openId={ (uSearch.go !== undefined && uSearch.go.length > 1) ? uSearch.go : '' }
          data={ response.data.blocks.services }
        /> ],

      [ 'com-related', <Related data={ response.data.blocks.related } /> ],

    ].forEach(function(component) {
      Inferno.render(component[1], document.getElementById(component[0]));
    });
  })
  .catch(function (error) {
    console.log(error);
  });

