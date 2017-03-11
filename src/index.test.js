
import Inferno from 'inferno';
// import Axios   from 'axios';

import Advantages from './components/Advantages';
import Services   from './components/Services';
import Related    from './components/Related';

const test = require('tape');

require('tape-dom')(test);


test('Create new object test', function(t) {
  t.plan(3);

  t.equal(typeof(<Advantages />), 'object', 'Create Advantages commponent');
  t.equal(typeof(<Services />), 'object', 'Create Services commponent');
  t.equal(typeof(<Related />), 'object', 'Create Related commponent');

  t.end();
});

