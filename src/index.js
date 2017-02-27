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

    Inferno.render(<Advantages data={ response.data.blocks.advantages } />,
      document.getElementById('com-advantages'));

    Inferno.render(<Services
      openId={ (uSearch.go !== undefined && uSearch.go.length > 1) ? uSearch.go : '' }
      data={ response.data.blocks.services }
    />, document.getElementById('com-services'));

    Inferno.render(<Related data={ response.data.blocks.related } />,
      document.getElementById('com-related'));
  })
  .catch(function (error) {
    console.log(error);
  });

