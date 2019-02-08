import Extension from '../extension';
import ExtensionProxy from '../extension-proxy';
import postElement from '../post-element';

jest.mock('../extension');
jest.useFakeTimers();

describe('extension-proxy', () => {
  const MockExtension = Extension as jest.Mock<Extension>;
  const requestIdleCallback = jest.fn(fn => fn({ didTimeout: false, timeRemaining: () => 0 }));
  window.requestIdleCallback = requestIdleCallback;

  beforeEach(() => {
    MockExtension.mockClear();
  });

  describe('when post element exist in DOM', () => {
    let element = postElement.create();

    beforeEach(() => {
      document.body.appendChild(element);
    });

    afterEach(() => {
      document.body.removeChild(element);
    });

    it('should activate extension', () => {
      const extensionProxy = new ExtensionProxy();
      extensionProxy.activate();
      expect(MockExtension).toHaveBeenCalled();
      const mockExtensionInstance = MockExtension.mock.instances[0];
      expect(mockExtensionInstance.activate).toHaveBeenCalled();
    });

    it('should deactivate extension when extension is already activated', () => {
      const extensionProxy = new ExtensionProxy();
      extensionProxy.activate();
      extensionProxy.deactivate();
      const mockExtensionInstance = MockExtension.mock.instances[0];
      expect(mockExtensionInstance.deactivate).toHaveBeenCalled();
    });

    it('should not deactivate extension when extension is not activated', () => {
      const extensionProxy = new ExtensionProxy();
      extensionProxy.deactivate();
      const mockExtensionInstance = MockExtension.mock.instances[0];
      expect(mockExtensionInstance.deactivate).not.toHaveBeenCalled();
    });
  });

  describe('when post element not exist in DOM', () => {
    it('should repeatedly execute activation step but not infinitely', () => {
      const extensionProxy = new ExtensionProxy();
      extensionProxy.activate();
      jest.runAllTimers();
      const callCount = requestIdleCallback.mock.calls.length;
      expect(callCount).toBeGreaterThan(30);
      expect(callCount).toBeLessThan(100);
    });
  });
});
