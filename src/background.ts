import { ExtensionOneOffMessageEvent } from './internal/types';

const URL = 'https://www.instagram.com/';

/**
 * For a user accessing https://www.instagram.com directly.
 *
 * For events.UrlFilters,
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/events/UrlFilter
 * For tabs API,
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs
 */
chrome.webNavigation.onCompleted.addListener(
  details => {
    chrome.tabs.sendMessage(details.tabId, { command: 'activate' } as ExtensionOneOffMessageEvent);
  },
  {
    url: [{ urlEquals: URL }],
  },
);

/**
 * Instagram Web Application is based on SPA (Single Page Application) with React-Router.
 * This use History API for client-side routing. So, after the first loading of JavaScript files,
 * The events like onDOMContentLoaded, onCompleted is not dispatched. Because of this extension
 * need to be executed in only https://www.instagram.com/, commands like 'activate', 'deactivate'
 * are sent to client script in the browser extension.
 *
 * For webNavigation and the sequense of events,
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webNavigation
 */
chrome.webNavigation.onHistoryStateUpdated.addListener(
  details => {
    const command = details.url === URL ? 'activate' : 'deactivate';
    chrome.tabs.sendMessage(details.tabId, { command } as ExtensionOneOffMessageEvent);
  },
  {
    url: [{ hostEquals: 'www.instagram.com', schemes: ['https'] }],
  },
);
