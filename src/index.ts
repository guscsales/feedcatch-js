import './styles/fonts/OpenSans-Regular.ttf';
import './styles/fonts/OpenSans-Bold.ttf';
import './styles/core.scss';
import './styles/plugin.scss';

import idea from './assets/images/idea.svg';

const div = document.createElement('div');
div.setAttribute('class', 'my-div');
div.style.width = '50px';
div.innerHTML = idea;
document.body.appendChild(div);
