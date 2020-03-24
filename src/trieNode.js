/**
 * datastructures-js/trie
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 * @license MIT
 */

/**
 * @class TrieNode
 */
class TrieNode {
  constructor(char) {
    this.char = char;
    this.endOfWord = false;
    this.parentNode = null;
    this.children = new Map();
  }

  /**
   * @returns {string}
   */
  getChar() {
    return this.char;
  }

  /**
   * @param {TrieNode} parentNode
   */
  setParent(parentNode) {
    this.parentNode = parentNode;
  }

  /**
   * @return {TrieNode}
   */
  getParent() {
    return this.parentNode;
  }

  /**
   * @param {boolean} endOfWord
   */
  setEndOfWord(endOfWord) {
    this.endOfWord = endOfWord;
  }

  /**
   * @return {boolean}
   */
  isEndOfWord() {
    return this.endOfWord;
  }

  /**
   * @param {string} char
   */
  addChild(char) {
    const childNode = new TrieNode(char);
    childNode.setParent(this);
    this.children.set(char, childNode);
  }

  /**
   * @param {string} char
   * @return {boolean}
   */
  removeChild(char) {
    return this.children.delete(char);
  }

  /**
   * @param {string} char
   * @return {TrieNode}
   */
  getChild(char) {
    return this.children.get(char) || null;
  }

  /**
   * @param {string} char
   * @return {boolean}
   */
  hasChild(char) {
    return this.children.has(char);
  }

  /**
   * @return {Map}
   */
  getChildren() {
    return this.children;
  }

  childrenCount() {
    return this.children.size;
  }
}

module.exports = TrieNode;