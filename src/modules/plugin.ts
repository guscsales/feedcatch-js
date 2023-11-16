import '../styles/core.scss';
import '../styles/widget.scss';

import widgetTemplate from '../templates/widget-wrapper.ejs';
import rateOne from '../assets/images/rate-1.svg';
import rateTwo from '../assets/images/rate-2.svg';
import rateThree from '../assets/images/rate-3.svg';
import rateFour from '../assets/images/rate-4.svg';
import rateFive from '../assets/images/rate-5.svg';
import issue from '../assets/images/issue.svg';
import idea from '../assets/images/idea.svg';
import other from '../assets/images/other.svg';

export enum Screens {
  ChooseOption = 'choose-option',
  GiveFeedback = 'give-feedback',
}

export enum Values {
  NPS1 = 'nps-1',
  NPS2 = 'nps-2',
  NPS3 = 'nps-3',
  NPS4 = 'nps-4',
  NPS5 = 'nps-5',
  Issue = 'issue',
  Idea = 'idea',
  Other = 'other',
}

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
    label: 'Sad to hear',
    description: 'How can we improve?',
  },
  {
    svg: rateTwo,
    value: 'nps-2',
    label: 'Sad to hear',
    description: 'How can we improve?',
  },
  {
    svg: rateThree,
    value: 'nps-3',
    label: 'Sad to hear',
    description: 'How can we improve?',
  },
  {
    svg: rateFour,
    value: 'nps-4',
    label: "We're almost there",
    description: 'How your experience could be better?',
  },
  {
    svg: rateFive,
    value: 'nps-5',
    label: 'Amazing!',
    description: 'Feel free to tell us more!',
  },
];

const types = [
  {
    svg: issue,
    value: 'issue',
    label: 'Issue',
    description: 'What you notice?',
  },
  {
    svg: idea,
    value: 'idea',
    label: 'Idea',
    description: 'Tell us more!',
  },
  {
    svg: other,
    value: 'other',
    label: 'Other',
    description: 'Tell us more!',
  },
];

let data: { value?: Values; message?: string } = {};

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

function renderWidgetWrapper() {
  const widget = document.createElement('div');
  widget.setAttribute('data-feedcatch-widget', '');

  document.body.append(widget);
}

function renderWidgetPosition({ trigger }) {
  const widget = document.querySelector(
    '[data-feedcatch-widget]'
  ) as HTMLDivElement;

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

function handleClickFeedCatchItem() {
  const target = this as HTMLButtonElement;
  const value = target.getAttribute('data-feedcatch-value') as Values;

  data = { ...data, value };

  renderWidgetScreen({ screen: Screens.GiveFeedback, value });
}

function renderWidgetScreen({
  screen,
  value,
}: {
  screen: Screens;
  value?: Values;
}) {
  const widget = document.querySelector('[data-feedcatch-widget]');
  let valueData = null;

  if (value) {
    valueData = [...npsValues, ...types].find((item) => item.value === value);
  }

  widget.innerHTML = widgetTemplate({ npsValues, types, screen, ...valueData });

  const elements = document.querySelectorAll(
    '[data-feedcatch-widget] [data-feedcatch-item]'
  );

  elements.forEach((element) => {
    element.removeEventListener('click', handleClickFeedCatchItem);
    element.addEventListener('click', handleClickFeedCatchItem);
  });
}

export function init() {
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

  renderWidgetWrapper();
  renderWidgetScreen({ screen: Screens.GiveFeedback, value: Values.Issue });
  renderWidgetPosition({ trigger });
}
