import './styles/fonts/OpenSans-Regular.ttf';
import './styles/fonts/OpenSans-Bold.ttf';
import './styles/core.scss';
import './styles/widget.scss';

import widgetTemplate from './templates/widget-wrapper.ejs';
import rateOne from './assets/images/rate-1.svg';
import rateTwo from './assets/images/rate-2.svg';
import rateThree from './assets/images/rate-3.svg';
import rateFour from './assets/images/rate-4.svg';
import rateFive from './assets/images/rate-5.svg';
import issue from './assets/images/issue.svg';
import idea from './assets/images/idea.svg';
import other from './assets/images/other.svg';

type Options = {
  position:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
    | 'left-center'
    | 'right-center';
};

let options = {} as Options;

const npsValues = [
  {
    svg: rateOne,
    value: 'nps-1',
  },
  {
    svg: rateTwo,
    value: 'nps-2',
  },
  {
    svg: rateThree,
    value: 'nps-3',
  },
  {
    svg: rateFour,
    value: 'nps-4',
  },
  {
    svg: rateFive,
    value: 'nps-5',
  },
];

const types = [
  {
    svg: issue,
    value: 'issue',
    label: 'Issue',
  },
  {
    svg: idea,
    value: 'idea',
    label: 'Idea',
  },
  {
    svg: other,
    value: 'other',
    label: 'Other',
  },
];

function getTrigger(): HTMLDivElement {
  return document.querySelector('[data-feedcatch-trigger]');
}

function setWidgetPosition({
  position,
  widget,
  trigger,
}: {
  position: Options['position'];
  widget: HTMLDivElement;
  trigger: HTMLDivElement;
}) {
  const {
    left: triggerX,
    top: triggerY,
    height: triggerHeight,
    width: triggerWidth,
  } = trigger.getBoundingClientRect();
  const widgetWidth = widget.clientWidth;
  const widgetHeight = widget.clientHeight;

  let [yPosition, xPosition] = position.split('-');

  if (['top', 'bottom'].includes(yPosition)) {
    const extraSpacing = 8;

    widget.style.top =
      yPosition === 'bottom'
        ? `${triggerY + triggerHeight + extraSpacing}px`
        : `${triggerY - widgetHeight - extraSpacing}px`;

    switch (xPosition) {
      case 'left':
        widget.style.left = `${triggerX - widgetHeight + triggerWidth / 2}px`;
        break;
      case 'right':
        widget.style.left = `${triggerX}px`;
        break;
      case 'center':
        widget.style.left = `${
          triggerX - widgetWidth / 2 + triggerWidth / 2 + extraSpacing
        }px`;
        break;
    }
  } else if (['left', 'right'].includes(yPosition)) {
    const extraSpacing = 16;

    widget.style[yPosition === 'left' ? 'right' : 'left'] = `${
      triggerX + triggerWidth + extraSpacing
    }px`;
    widget.style.top = `${widgetHeight - triggerHeight + extraSpacing}px`;
  }
}

function renderWidget({ trigger }) {
  const widget = document.createElement('div');
  widget.setAttribute('data-feedcatch-widget', '');

  widget.innerHTML = widgetTemplate({ npsValues, types });

  document.body.append(widget);

  setWidgetPosition({
    position: options.position,
    widget,
    trigger,
  });

  window.addEventListener('resize', () => {
    setWidgetPosition({
      position: options.position,
      widget,
      trigger,
    });
  });
}

function init() {
  const trigger = getTrigger();

  if (!trigger) {
    console.warn(
      'FeedCatch: no trigger found. To initialize the library you need to create an element using the "data-feedcatch-trigger" attribute.'
    );
    return;
  }

  options = {
    position:
      (trigger.getAttribute(
        'data-feedcatch-position'
      ) as Options['position']) || 'bottom-center',
  };

  renderWidget({ trigger });
}

init();
