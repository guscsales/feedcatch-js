import './styles/fonts/OpenSans-Regular.ttf';
import './styles/fonts/OpenSans-Bold.ttf';
import './styles/core.scss';
import './styles/plugin.scss';

const div = document.createElement('div');
div.setAttribute('class', 'my-div');
div.innerHTML = 'testing';
document.body.appendChild(div);
