const VISIBLE_CLASS = 'visible';
const HIDDEN_CLASS = 'hidden';
const TRIGGER_CLASS = 'trigger';
const NAV_WRAPPER_CLASS = 'nav';

const RIGHT_ARROW_KEY = 39;
const LEFT_ARROW_KEY = 37;
const HOME_KEY = 36;
const END_KEY = 35;

export default class Tabs {
  constructor(container, options = {}) {
    this.setUpElements(container);
    this.options = options;
    this.tabIds = [];
    this._clickHandler = this.clickHandler.bind(this);
    this._keyDownHandler = this.keyDownHandler.bind(this);
    this.setUpAriaAttributes();
  }

  setUpElements(container) {
    this.container = document.querySelector(container);
    this.navWrapper = this.container.querySelector(`.${NAV_WRAPPER_CLASS}`);
    this.triggerElems = this.navWrapper.querySelectorAll(`.${TRIGGER_CLASS}`);
  }

  setUpAriaAttributes() {
    this.navWrapper.setAttribute('role', 'tablist');

    if (this.options.ariaLabel) {
      this.navWrapper.setAttribute('aria-label', this.options.ariaLabel);
    }

    this.triggerElems.forEach((element, index) => {
      const contentId = element.getAttribute('aria-controls');
      const contentElem = this.container.querySelector(`#${contentId}`);

      this.tabIds.push(contentId);

      element.setAttribute('role', 'tab');
      element.setAttribute('id', contentId.concat('-tab'));

      contentElem.setAttribute('tabindex', 0);
      contentElem.setAttribute('role', 'tabpanel');
      contentElem.setAttribute('aria-labelledby', contentId.concat('-tab'));

      element.addEventListener('click', this._clickHandler);
      element.addEventListener('keydown', this._keyDownHandler);

      if (index === 0) {
        this.selectTab(element, contentElem);
      } else {
        this.deSelectTab(element, contentElem);
      }
    });
  }

  selectTab(triggerElem, contentElem) {
    triggerElem.setAttribute('tabindex', 0);
    triggerElem.classList.add(VISIBLE_CLASS);
    triggerElem.setAttribute('aria-selected', true);
    contentElem.classList.remove(HIDDEN_CLASS);
    contentElem.classList.add(VISIBLE_CLASS);
  }

  deSelectTab(triggerElem, contentElem) {
    triggerElem.setAttribute('tabindex', -1);
    triggerElem.classList.remove(VISIBLE_CLASS);
    triggerElem.setAttribute('aria-selected', false);
    contentElem.classList.add(HIDDEN_CLASS);
    contentElem.classList.remove(VISIBLE_CLASS);
  }

  clickHandler(event) {
    event.preventDefault();
    const selectedContentId = event.target.getAttribute('aria-controls');
    this.doSelection(selectedContentId);
  }

  doSelection(selectedContentId) {
    this.triggerElems.forEach(element => {
      const contentId = element.getAttribute('aria-controls');
      const contentElem = this.container.querySelector(`#${contentId}`);

      if (selectedContentId === contentId) {
        this.selectTab(element, contentElem);
      } else {
        this.deSelectTab(element, contentElem);
      }
    });
  }

  updateFocus(triggerIndex) {
    const contentId = this.triggerElems[triggerIndex].getAttribute(
      'aria-controls'
    );
    this.doSelection(contentId);
    this.triggerElems[triggerIndex].focus();
  }

  keyDownHandler(event) {
    event.preventDefault();
    const contentId = event.target.getAttribute('aria-controls');
    const currentIndex = this.tabIds.indexOf(contentId);
    const isFirst = this.isFirst(currentIndex);
    const isLast = this.isLast(currentIndex);

    switch (event.keyCode) {
      case RIGHT_ARROW_KEY:
        if (isLast) {
          this.updateFocus(0);
        } else {
          this.updateFocus(currentIndex + 1);
        }
        break;

      case LEFT_ARROW_KEY:
        if (isFirst) {
          this.updateFocus(this.tabIds.length - 1);
        } else {
          this.updateFocus(currentIndex - 1);
        }
        break;

      case HOME_KEY:
        this.updateFocus(0);
        break;

      case END_KEY:
        this.updateFocus(this.tabIds.length - 1);
        break;

      default:
        break;
    }
  }

  isFirst(index) {
    return index === 0;
  }

  isLast(index) {
    return index === this.tabIds.length - 1;
  }

  destroy() {
    this.container.remove();
  }
}
