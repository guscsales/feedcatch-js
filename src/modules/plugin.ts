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
import close from '../assets/images/close.svg';

export enum Screens {
  ChooseOption = 'choose-option',
  GiveFeedback = 'give-feedback',
  Success = 'success',
}

export enum Values {
  NPS1 = 'NPS-1',
  NPS2 = 'NPS-2',
  NPS3 = 'NPS-3',
  NPS4 = 'NPS-4',
  NPS5 = 'NPS-5',
  Issue = 'Issue',
  Idea = 'Idea',
  Other = 'Other',
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
    value: 'NPS-1',
    label: 'Unhappy',
    description: 'How can we improve?',
  },
  {
    svg: rateTwo,
    value: 'NPS-2',
    label: 'Dissatisfied',
    description: 'How can we improve?',
  },
  {
    svg: rateThree,
    value: 'NPS-3',
    label: 'Neutral',
    description: 'How can we improve?',
  },
  {
    svg: rateFour,
    value: 'NPS-4',
    label: 'Satisfied',
    description: 'What we could do better?',
  },
  {
    svg: rateFive,
    value: 'NPS-5',
    label: 'Delighted',
    description: 'Feel free to tell us more!',
  },
];

const types = [
  {
    svg: issue,
    value: 'Issue',
    label: 'Issue',
    description: 'What you notice?',
  },
  {
    svg: idea,
    value: 'Idea',
    label: 'Idea',
    description: 'Tell us more!',
  },
  {
    svg: other,
    value: 'Other',
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

function renderWidgetWrapper({ trigger }) {
  const widget = document.createElement('div');
  widget.setAttribute('data-feedcatch-widget', '');

  document.body.append(widget);

  trigger.addEventListener('click', () => {
    (
      document.querySelector('[data-feedcatch-widget]') as HTMLDivElement
    ).style.display = '';
  });
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

  widget.style.display = 'none';

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

function isFromFeedcatch(target: HTMLElement) {
  let parentElement = target.parentElement;

  while (parentElement) {
    const hasFeedcatchAttr = parentElement
      .getAttributeNames()
      .some(
        (attr) => attr.includes('feedcatch') && attr !== 'data-feedcatch-close'
      );

    if (hasFeedcatchAttr) {
      return true;
    }

    parentElement = parentElement.parentElement;
  }

  return false;
}

function handleClickClose(e, screen = null) {
  const target = e.target as HTMLElement;

  if (
    (isFromFeedcatch(target) ||
      target.hasAttribute('data-feedcatch-trigger') ||
      target.hasAttribute('data-feedcatch-widget')) &&
    !target.hasAttribute('data-feedcatch-close') &&
    !target.parentElement.hasAttribute('data-feedcatch-close') &&
    !target.hasAttribute('data-feedcatch-button-close')
  ) {
    return false;
  }

  const widget = document.querySelector(
    '[data-feedcatch-widget]'
  ) as HTMLDivElement;

  widget.style.display = 'none';

  if (screen) {
    renderWidgetScreen({ screen });
  }
}

function goToScreen(screen) {
  renderWidgetScreen({ screen });
}

async function handleSubmitFeedback(e: SubmitEvent) {
  e.preventDefault();

  const form = document.querySelector(
    '[data-feedcatch-form]'
  ) as HTMLFormElement;

  const formData = new FormData(form);

  const content = (formData.get('message') as string) || null;

  const projectId = document
    .querySelector('[data-feedcatch-pid]')
    .getAttribute('data-feedcatch-pid');

  let value = data.value;
  let rate = null;

  if (value.startsWith('NPS-')) {
    const [npsValue, npsRate] = value.split('-');

    value = npsValue as Values;
    rate = parseInt(npsRate);
  }

  const submitButton = document.querySelector('[data-feedcatch-submit]');
  const submitButtonLoading = submitButton.querySelector(
    '[data-feedcatch-loading]'
  ) as HTMLDivElement;
  const errorMessage = document.querySelector(
    '[data-feedcatch-error]'
  ) as HTMLDivElement;

  submitButton.setAttribute('disabled', 'disabled');
  submitButtonLoading.style.display = '';
  errorMessage.style.display = '';

  try {
    const response = await fetch(`${process.env.BASE_API}/feedbacks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'fc-project-id': projectId,
      },
      body: JSON.stringify({
        type: value,
        content,
        rate,
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    });

    if (!response.ok) {
      console.error(
        `FeedCatch: error on send feedback. Status: ${response.status} - More details: ${response.statusText}`
      );

      errorMessage.style.display = 'block';
    } else {
      renderWidgetScreen({
        screen: Screens.Success,
      });
    }
  } catch (e) {
    console.error('FeedCatch: error on send feedback. More details:', e);
    errorMessage.style.display = 'block';
  } finally {
    submitButton.removeAttribute('disabled');
    submitButtonLoading.style.display = 'none';
  }
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

  widget.innerHTML = widgetTemplate({
    npsValues,
    types,
    screen,
    close,
    ...valueData,
  });

  // Remove all events
  document.body?.removeEventListener('click', handleClickClose);
  document
    .querySelectorAll('[data-feedcatch-widget] [data-feedcatch-item]')
    ?.forEach((element) => {
      element.removeEventListener('click', handleClickFeedCatchItem);
    });
  document
    .querySelector('[data-feedcatch-form]')
    ?.removeEventListener('submit', handleSubmitFeedback);

  // General
  // Close button
  document.body?.addEventListener('click', handleClickClose);

  if (screen === Screens.ChooseOption) {
    // Events for feedback types
    document
      .querySelectorAll('[data-feedcatch-widget] [data-feedcatch-item]')
      ?.forEach((element) => {
        element.removeEventListener('click', handleClickFeedCatchItem);
        element.addEventListener('click', handleClickFeedCatchItem);
      });
  } else if (screen === Screens.GiveFeedback) {
    // Back button on send feedback
    document
      .querySelector('[data-feedcatch-back]')
      ?.addEventListener('click', () => goToScreen(Screens.ChooseOption), {
        once: true,
      });

    // Submit button
    document
      .querySelector('[data-feedcatch-form]')
      ?.addEventListener('submit', handleSubmitFeedback);
  } else if (screen === Screens.Success) {
    document
      .querySelector('[data-feedcatch-success] [data-feedcatch-back]')
      ?.addEventListener('click', () => goToScreen(Screens.ChooseOption), {
        once: true,
      });
    document
      .querySelector('[data-feedcatch-success] [data-feedcatch-button-close]')
      ?.addEventListener(
        'click',
        (e) => handleClickClose(e, Screens.ChooseOption),
        { once: true }
      );
  }
}

export function init() {
  const trigger = getTrigger();

  if (!trigger) {
    console.error(
      'FeedCatch: no trigger found. To initialize the library you need to create an element using the "data-feedcatch-trigger" attribute.'
    );
    return;
  }

  const projectId = document.querySelector('[data-feedcatch-pid]');

  if (!projectId) {
    console.error(
      'FeedCatch: no project id found. To initialize the library you need to pass your project id "data-feedcatch-pid" attribute on script tag.'
    );
    return;
  }

  options = {
    position:
      (trigger.getAttribute(
        'data-feedcatch-position'
      ) as Options['position']) || 'bottom-center',
  };

  renderWidgetWrapper({ trigger });
  renderWidgetScreen({ screen: Screens.ChooseOption });
  renderWidgetPosition({ trigger });
}
