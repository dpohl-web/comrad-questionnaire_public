// import { configure } from '@storybook/react';

// function loadStories() {
//   require('../src/stories');
// }

// configure(loadStories, module);

import { configure } from '@storybook/react';

const req = require.context('../src/components', true, /\.stories\.js$/)
require('../src/components/Atoms/Layout/Layout.css');


function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);