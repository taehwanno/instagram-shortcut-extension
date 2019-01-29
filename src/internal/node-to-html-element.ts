/**
 * Convert DOM Node to HTMLElement
 *
 * Based on DOM specification, HTMLCollection is a collection of object that extend an Element.
 * In Chrome and Firefox both, those objects are HTMLElement.
 * So I use an explicit type cast with 'as' keyword.
 * @See https://dom.spec.whatwg.org/#htmlcollection
 *
 * @param {Node} node
 * @return {HTMLElement}
 */
function nodeToHtmlElement(node: Node) {
  const parentChildNodes = Array.from(node.parentElement.childNodes) as Node[];
  const index = parentChildNodes.indexOf(node);
  return node.parentElement.children[index] as HTMLElement;
}

export default nodeToHtmlElement;
