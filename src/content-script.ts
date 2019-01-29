import ExtensionProxy from './internal/extension-proxy';
import { ExtensionOneOffMessageEvent } from './internal/types';

const extensionProxy = new ExtensionProxy();

chrome.runtime.onMessage.addListener((message: ExtensionOneOffMessageEvent) => {
  switch (message.command) {
    case 'activate':
      return extensionProxy.activate();
    case 'deactivate':
      return extensionProxy.deactivate();
  }
});
