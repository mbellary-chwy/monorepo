import uniqueId from 'lodash/uniqueId';
import Tabs from '@mansoorbashabellary/tabs/src';

const TRIGGER_WRAPPER_CLASS = 'trigger-wrapper';
const TRIGGER_CLASS = 'trigger';
const CONTENT_CLASS = 'content';
const TRIGGER_DISABLED_CLASS = 'pill';
const DISABLED_CLASS = 'disabled';
const OPEN_CLASS = 'open';
const SINGLE_OPEN_KEY = 'singleOpen';

const UP_ARROW_KEY = 38;
const DOWN_ARROW_KEY = 40;
const HOME_KEY = 36;
const END_KEY = 35;
const ENTER_KEY = 13;
const SPACE_KEY = 32;

export default class Accordion {
  constructor(container, options) {
    this.setUpElements(container);
    this.options = options;
  }

  setUpElements(container) {
    this.container = document.querySelector(container);
    this.triggerWrappers = this.container.querySelectorAll(
      `.${TRIGGER_WRAPPER_CLASS}`
    );
    this.triggers = this.container.querySelectorAll(`.${TRIGGER_CLASS}`);
    this.contents = this.container.querySelectorAll(`.${CONTENT_CLASS}`);
  }

  createUniqueId() {
    return uniqueId('cw-accordion-item-');
  }

  setUpAriaAttributes() {
    this.container.setAttribute('role', 'presentation');

    this.triggerWrappers.forEach((element, index) => {
      const uniqueId = this.createUniqueId();
      const triggerElem = this.triggers[index];
      const contentElem = this.contents[index];
      element.setAttribute('role', 'heading');

      triggerElem.setAttribute('role', 'button');
      triggerElem.setAttribute('id', uniqueId);
      triggerElem.setAttribute('aria-controls', `${uniqueId}-panel`);
      triggerElem.setAttribute('aria-expanded', false);

      contentElem.setAttribute('role', 'region');
      contentElem.setAttribute('aria-labelledby', uniqueId);
      contentElem.setAttribute('id', `${uniqueId}-panel`);
      contentElem.setAttribute('aria-hidden', true);
    });
  }

  setUpDisabledItems() {
    this.triggerWrappers.forEach(element => {
      const disabledElem = element.querySelector(`.${TRIGGER_DISABLED_CLASS}`);
      if (disabledElem) {
        element.classList.add(DISABLED_CLASS);
      }
    });
  }

  setUpEvents() {
    this.triggers.forEach(element => {
      this.triggerIds.push(element.getAttribute('id'));
      element.addEventListener('click', this._clickHandler);
      element.addEventListener('keydown', this._keyDownHandler);
    });
  }

  clickHandler(event) {
    event.preventDefault();

    const targetItem = event.target.closest(`.${TRIGGER_WRAPPER_CLASS}`);
    const isDisabled = this.isDisabled(targetItem);

    if (!isDisabled) {
      const isOpen = this.isOpen(targetItem);

      if (isOpen) {
        this.close(targetItem);
      } else if (!isOpen && this.getOption(SINGLE_OPEN_KEY)) {
        this.closeAll();
        this.open(targetItem);
      } else {
        this.open(targetItem);
      }
    }
  }

  isFirst(index) {
    return index === 0;
  }

  isLast(index) {
    return index === this.triggerIds.length - 1;
  }

  keyDownHandler(event) {
    event.preventDefault();
    const elemId = event.target.getAttribute('id');
    const currentIndex = this.triggerIds.indexOf(elemId);
    const isFirst = this.isFirst(currentIndex);
    const isLast = this.isLast(currentIndex);

    switch (event.keyCode) {
      case DOWN_ARROW_KEY:
        if (isLast) {
          this.triggers[0].focus();
        } else {
          this.triggers[currentIndex + 1].focus();
        }
        break;

      case UP_ARROW_KEY:
        if (isFirst) {
          this.triggers[this.triggers.length - 1].focus();
        } else {
          this.triggers[currentIndex - 1].focus();
        }
        break;

      case HOME_KEY:
        this.triggers[0].focus();
        break;

      case END_KEY:
        this.triggers[this.triggers.length - 1].focus();
        break;

      case ENTER_KEY:
      case SPACE_KEY:
        this._clickHandler(event);
        break;

      default:
        break;
    }
  }

  isDisabled(elem) {
    return elem.classList.contains(DISABLED_CLASS);
  }

  isOpen(elem) {
    return elem.classList.contains(OPEN_CLASS);
  }

  close(elem) {
    const triggerElem = elem.querySelector(`.${TRIGGER_CLASS}`);
    const contentId = triggerElem.getAttribute('aria-controls');
    const contentElem = this.container.querySelector(`#${contentId}`);

    if (contentElem) {
      elem.classList.remove(OPEN_CLASS);
      contentElem.classList.remove(OPEN_CLASS);
      contentElem.style.maxHeight = 0;
      triggerElem.setAttribute('aria-expanded', false);
      contentElem.setAttribute('aria-hidden', true);
    }
  }

  open(elem) {
    const noAnimation = elem.dataset.noanimation || false;
    const triggerElem = elem.querySelector(`.${TRIGGER_CLASS}`);
    const contentId = triggerElem.getAttribute('aria-controls');
    const contentElem = this.container.querySelector(`#${contentId}`);

    elem.classList.add(OPEN_CLASS);
    contentElem.classList.add(OPEN_CLASS);

    if (contentElem) {
      if (!noAnimation) {
        const contentHeight = contentElem.scrollHeight;
        contentElem.style.maxHeight = `${contentHeight}px`;
      } else {
        contentElem.style.maxHeight = 'none';
      }

      triggerElem.setAttribute('aria-expanded', true);
      contentElem.setAttribute('aria-hidden', false);
    }
  }

  getOption(optionName) {
    return this.options && this.options[optionName]
      ? this.options[optionName]
      : false;
  }

  closeAll() {
    this.triggerWrappers.forEach(element => {
      const triggerElem = element.querySelector(`.${TRIGGER_CLASS}`);
      const contentId = triggerElem.getAttribute('aria-controls');
      const contentElem = this.container.querySelector(`#${contentId}`);

      element.classList.remove(OPEN_CLASS);
      contentElem.classList.remove(OPEN_CLASS);
      contentElem.style.maxHeight = 0;
    });
  }

  destroy() {
    this.triggers.forEach(element => {
      element.removeEventListener('click', this._clickHandler);
      element.removeEventListener('keydown', this._keyDownHandler);
    });
    this.container.remove();
  }
}
