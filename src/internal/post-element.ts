const selector = 'section article';

/**
 * Instagram post DOM element helper.
 */
const postElement = {
  create() {
    const section = document.createElement('section');
    const article = document.createElement('article');
    section.appendChild(article);
    return section;
  },
  exist() {
    return !!this.get();
  },
  get() {
    return document.querySelector(selector);
  },
  getParent() {
    const element = this.get();
    return element && element.parentElement;
  },
  getSelector() {
    return selector;
  },
};

export default postElement;
