import bind from './bind';
import nodeToHtmlElement from './node-to-html-element';
import postElement from './post-element';

export interface IExtension {
  activate(): void;
  deactivate(): void;
}

const ARTICLE = 'ARTICLE';
const TEXTAREA = 'TEXTAREA';
const INPUT = 'INPUT';

class Extension implements IExtension {
  container: HTMLElement;
  currentPost: HTMLElement;
  headerHeight: number;
  threshold: number;
  intersectionObserver: IntersectionObserver;
  mutationObserver: MutationObserver;

  public constructor() {
    this.headerHeight = 52;
    this.threshold = 0.6;
  }

  private initialize() {
    this.container = postElement.getParent();
    this.currentPost = null;
    this.intersectionObserver = new IntersectionObserver(this.handleIntersection, {
      threshold: this.threshold,
    });
    this.mutationObserver = new MutationObserver(this.handleMutation);
  }

  private dispose() {
    this.container = null;
    this.currentPost = null;
    this.intersectionObserver = null;
    this.mutationObserver = null;
  }

  public activate() {
    this.initialize();
    this.observeIntersection();
    this.observeMutation();
    document.addEventListener('keydown', this.handleKeydown);
  }

  public deactivate() {
    this.intersectionObserver.disconnect();
    this.mutationObserver.disconnect();
    document.removeEventListener('keydown', this.handleKeydown);
    this.dispose();
  }

  private observeIntersection() {
    Array.from(this.container.querySelectorAll(ARTICLE)).map(article =>
      this.intersectionObserver.observe(article),
    );
  }

  @bind
  private handleIntersection(entries: IntersectionObserverEntry[]) {
    const entry = entries.find(e => e.isIntersecting && e.intersectionRatio > this.threshold);
    if (entry) {
      this.currentPost = entry.target as HTMLElement;
    }
  }

  @bind
  private observeMutation() {
    this.mutationObserver.observe(this.container, { childList: true });
  }

  @bind
  private handleMutation(mutations: MutationRecord[]) {
    mutations
      .filter(mutationRecord => mutationRecord.addedNodes.length !== 0)
      .map(mutationRecord => Array.from(mutationRecord.addedNodes))
      .reduce((arr, addedNodes) => arr.concat(addedNodes), [])
      .map(nodeToHtmlElement)
      // It only observes posts and does not care about other elements.
      .filter(element => element.tagName === ARTICLE)
      .map(element => {
        this.intersectionObserver.observe(element);
      });
  }

  private selectCurrentPost(isDown: boolean) {
    if (!this.currentPost) {
      return null;
    }

    const key = isDown ? 'nextElementSibling' : 'previousElementSibling';
    let newCurrentPost = this.currentPost[key] as HTMLElement;

    // If the sibling is not a posting, it looks for the next sibling.
    if (newCurrentPost && newCurrentPost.tagName !== ARTICLE) {
      newCurrentPost = newCurrentPost[key] as HTMLElement;
    }

    if (newCurrentPost) {
      this.currentPost = newCurrentPost;
    }
  }

  @bind
  private handleKeydown(event: KeyboardEvent) {
    const {
      key,
      repeat,
      srcElement: { tagName },
    } = event;

    if (repeat || tagName === TEXTAREA || tagName === INPUT) {
      return;
    }

    switch (key) {
      case 'j': // Next
        this.selectCurrentPost(true);
        break;
      case 'k': // Previous
        this.selectCurrentPost(false);
        break;
      default:
        return;
    }

    if (this.currentPost) {
      window.scroll({
        top: this.currentPost.offsetTop + this.headerHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
  }
}

export default Extension;
