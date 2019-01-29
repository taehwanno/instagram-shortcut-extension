import bind from './bind';
import Extension, { IExtension } from './extension';
import postElement from './post-element';

class ExtensionProxy implements IExtension {
  private executionCount: number;
  private extension: Extension;
  private isActivated: boolean;

  constructor() {
    this.executionCount = 0;
    this.extension = new Extension();
    this.isActivated = false;
  }

  public activate() {
    if (!this.isActivated) {
      window.requestIdleCallback(this.handleActivate);
    }
  }

  @bind
  private handleActivate() {
    this.executionCount += 1;
    // Prevent infinite call when Instagram data server is not properly operated
    // or when the client's network status is not good.
    if (this.executionCount > 30 || this.isActivated) {
      return;
    }

    if (postElement.exist()) {
      this.isActivated = true;
      this.extension.activate();
    } else {
      window.requestIdleCallback(this.handleActivate);
    }
  }

  public deactivate() {
    if (this.isActivated) {
      this.isActivated = false;
      this.extension.deactivate();
    }
  }
}

export default ExtensionProxy;
