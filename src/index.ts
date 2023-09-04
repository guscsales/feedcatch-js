import './styles/fonts/OpenSans-Regular.ttf';
import './styles/fonts/OpenSans-Bold.ttf';
import './styles/core.scss';
import './styles/plugin.scss';

const div = document.createElement('div');
div.setAttribute('class', 'my-div');
console.log(process.env.NODE_ENV);
div.innerHTML = `testing - ${process.env.BASE_API}`;
document.body.appendChild(div);
