import bind from './bind';
import nodeToHtmlElement from './node-to-html-element';
import postElement from './post-element';

export interface IExtension {
  activate(): void;
  deactivate(): void;
}

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
    window.addEventListener('keydown', this.handleKeydown);
  }

  public deactivate() {
    this.intersectionObserver.disconnect();
    this.mutationObserver.disconnect();
    window.removeEventListener('keydown', this.handleKeydown);
    this.dispose();
  }

  private observeIntersection() {
    Array.from(this.container.querySelectorAll('article')).map(article =>
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
      .filter(mutationRecord => mutationRecord.addedNodes)
      .map(mutationRecord => Array.from(mutationRecord.addedNodes))
      .reduce((arr, addedNodes) => arr.concat(addedNodes), [])
      .map(nodeToHtmlElement)
      .map(element => {
        this.intersectionObserver.observe(element);
      });
  }

  @bind
  private handleKeydown(event: KeyboardEvent) {
    const {
      key,
      repeat,
      srcElement: { tagName },
    } = event;

    if (repeat || tagName === 'TEXTAREA' || tagName === 'INPUT') {
      return;
    }

    switch (key) {
      case 'j': // Next
        this.currentPost =
          (this.currentPost && (this.currentPost.nextElementSibling as HTMLElement)) ||
          this.currentPost;
        break;
      case 'k': // Previous
        this.currentPost =
          (this.currentPost && (this.currentPost.previousElementSibling as HTMLElement)) ||
          this.currentPost;
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
