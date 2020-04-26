/**
 * @datastructures-js/trie
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 * @license MIT
 */

const TrieNode = require('./trieNode');

/**
 * @class Trie
 */
class Trie {
  constructor() {
    this._root = new TrieNode(null);
    this._wordsCount = 0;
    this._nodesCount = 1; // root node
  }

  /**
   * @private
   * returns word as an Array
   * @param {string|Array} word
   * @returns {Array}
   */
  static getWordAsArray(word) {
    return Array.isArray(word) ? word : Array.from(word);
  }

  /**
   * @public
   * inserts a word into the trie and returns its last char node
   * @param {string|Array} _word
   * @param {TrieNode} node
   * @param {number} i
   * @returns {TrieNode}
   */
  insert(_word, node = this._root, i = 0) {
    if (typeof _word !== 'string' && !Array.isArray(_word)) {
      throw new Error('Trie.insert expects a string or array as word');
    }

    const word = Trie.getWordAsArray(_word);
    if (i === word.length) {
      if (!node.isEndOfWord()) {
        node.setEndOfWord(true);
        this._wordsCount += 1;
      }
      return node;
    }

    if (!node.hasChild(word[i])) {
      node.addChild(word[i]);
      this._nodesCount += 1;
    }

    return this.insert(word, node.getChild(word[i]), i + 1);
  }

  /**
   * @public
   * checks if a word exists in the trie
   * @param {string|Array} _word
   * @param {TrieNode} node
   * @param {number} i
   * @returns {boolean}
   */
  has(_word, node = this._root, i = 0) {
    if (typeof _word !== 'string' && !Array.isArray(_word)) return false;
    const word = Trie.getWordAsArray(_word);

    if (i === word.length) {
      return node.isEndOfWord();
    }

    if (!node.hasChild(word[i])) return false;

    return this.has(word, node.getChild(word[i]), i + 1);
  }

  /**
   * @public
   * finds a word in the trie and returns its last char node
   * @param {string|Array} _word
   * @param {TrieNode} node
   * @param {number} i
   * @returns {TrieNode}
   */
  find(_word, node = this._root, i = 0) {
    if (typeof _word !== 'string' && !Array.isArray(_word)) return null;
    const word = Trie.getWordAsArray(_word);

    if (i === word.length) {
      return node.isEndOfWord() ? node : null;
    }

    if (!node.hasChild(word[i])) return null;

    return this.find(word, node.getChild(word[i]), i + 1);
  }

  /**
   * @public
   * removes a word from the trie
   * @param {string|Array} _word
   * @returns {boolean}
   */
  remove(_word) {
    const word = Trie.getWordAsArray(_word);
    const lastNode = this.find(word);

    if (lastNode === null) return false;

    if (lastNode.childrenCount() > 0 || !word.length) {
      lastNode.setEndOfWord(false);
      this._wordsCount -= 1;
      return true;
    }

    let current = lastNode;
    while (current.getChar() !== null) {
      if (current.childrenCount() === 0) {
        current.getParent().removeChild(current.getChar());
        this._nodesCount -= 1;
      }
      current = current.getParent();
    }

    this._wordsCount -= 1;
    return true;
  }

  /**
   * @public
   * traverse the words in the trie
   * @param {function} cb
   * @param {TrieNode} node
   * @param {string|Array} w
   */
  forEach(cb, node = this._root, w = []) {
    if (typeof cb !== 'function') {
      throw new Error('Trie.forEach expects a callback');
    }

    let word = Trie.getWordAsArray(w);
    if (node.isEndOfWord()) {
      cb(word.every((item) => typeof item === 'string') ? word.join('') : word);
    }

    node.children().forEach((child) => {
      word = [...word, child.getChar()];
      this.forEach(cb, child, word); // depth-first search
      word = word.slice(0, word.length - 1); // backward tracking
    });
  }

  /**
   * @public
   * returns word that matches longest prefix with your input
   * @param {string|Array} _word
   * @param {TrieNode} node
   * @param {number} i
   * @returns {Array}
   */
  findClosestWord(_word, node = this._root, i = 0) {
    if (typeof _word !== 'string' && !Array.isArray(_word)) return null;
    const word = Trie.getWordAsArray(_word);
    let child;

    if (!node.getChildren().size) return [node.getChar()];

    if (i === word.length) {
      return [node.getChar()];
    }

    child = word.find((item) => node.getChildren().has(item));
    if (!child) {
      [child] = Array.from(node.getChildren().values());
    } else {
      child = node.getChildren().get(child);
    }

    return node.getChar() ? [
      node.getChar(),
      ...this.findClosestWord(word, child, i + 1)
    ] : this.findClosestWord(word, child, i + 1);
  }

  /**
   * @public
   * returns possible options for each item in input word
   * @param {string|Array} _word
   * @param {TrieNode} node
   * @param {number} i
   * @returns {Array}
   */
  getOptions(_word, node = this._root, i = 0) {
    if (typeof _word !== 'string' && !Array.isArray(_word)) return null;
    const word = Trie.getWordAsArray(_word);
    let child;

    if (!node.getChildren().size) return [];

    if (!node.hasChild(word[i])) {
      [child] = Array.from(node.getChildren().values());
    } else {
      child = node.getChild(word[i]);
    }

    return [
      Array.from(node.getChildren().keys()),
      ...this.getOptions(word, child, i + 1)
    ];
  }

  /**
   * @public
   * converts the trie into an array of words
   * @returns {array}
   */
  toArray() {
    const result = [];
    this.forEach((word) => result.push(word));
    return result;
  }

  /**
   * @public
   * @returns {number}
   */
  nodesCount() {
    return this._nodesCount;
  }

  /**
   * @public
   * @returns {number}
   */
  wordsCount() {
    return this._wordsCount;
  }

  /**
   * @public
   * clears the trie
   */
  clear() {
    this._root = new TrieNode(null);
    this._nodesCount = 1;
    this._wordsCount = 0;
  }
}

module.exports = Trie;
