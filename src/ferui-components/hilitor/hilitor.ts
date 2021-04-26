import { Injectable } from '@angular/core';

// Original JavaScript code by Chirp Internet: www.chirp.com.au
// Forked and adapted from https://www.the-art-of-web.com/javascript/search-highlight/
@Injectable()
export class HilitorService {
  // private variables
  private readonly hiliteTag: string = 'MARK';
  private readonly hiliteClass: string = 'fui-hilitor-search-term';
  private readonly skipTags: RegExp = new RegExp('^(?:' + this.hiliteTag + '|SCRIPT|FORM|SPAN)$');

  private targetNode: HTMLElement;
  private matchRegExp: RegExp = null;
  private openLeft: boolean = false;
  private openRight: boolean = false;
  private skipCustomTags: RegExp | null = null;
  private skipCustomClasses: RegExp | null = null;

  // characters to strip from start and end of the input string
  private endRegExp = new RegExp('^[^\\w]+|[^\\w]+$', 'g');
  // characters used to break up the input string into words
  private breakRegExp = new RegExp("[^\\w'-]+", 'g');

  /**
   * Set the targeted element where we want to apply our highlighting.
   * It can either be an ID or an HTMLElement. By default, we'll use the 'body' element.
   * @param target
   */
  setTargetNode(target: string | HTMLElement): void {
    this.targetNode = target instanceof HTMLElement ? target : document.getElementById(target) || document.body;
  }

  /**
   * Set characters to strip from start and end of the input string.
   * @param regex
   */
  setEndRegExp(regex): RegExp {
    this.endRegExp = regex;
    return this.endRegExp;
  }

  /**
   * Set characters used to break up the input string into words.
   * @param regex
   */
  setBreakRegExp(regex): RegExp {
    this.breakRegExp = regex;
    return this.breakRegExp;
  }

  /**
   * Set the match type for the final regex.
   * If match type is set to 'left' the regex expression will be changed to /\b(input|text)/i
   * If match type is set to 'right' the regex expression will be changed to /(input|text)\b/i
   * If match type is set to 'open' the regex expression will be changed to /(input|text)/i
   * By default the regex expression will be set to/\b(input|text)\b/i
   * @param type
   */
  setMatchType(type): void {
    switch (type) {
      case 'left':
        this.openLeft = false;
        this.openRight = true;
        break;
      case 'right':
        this.openLeft = true;
        this.openRight = false;
        break;
      case 'open':
        this.openLeft = this.openRight = true;
        break;
      default:
        this.openLeft = this.openRight = false;
    }
  }

  /**
   * Set the custom tags to skip.
   * If multiple tags, then use one space ' ' or a pipe '|' as separator.
   * i.e setCustomTagsToSkip('a i SVG') or setCustomTagsToSkip('a|i|SVG')
   * @param tags The tags isn't case sensitive. It will be uppercase automatically.
   */
  setCustomTagsToSkip(tags: string | null): void {
    // If the input is either '' or false or null or undefined we reset the variable and return.
    if (!tags) {
      this.skipCustomTags = null;
      return;
    }
    this.skipCustomTags = new RegExp('^(?:' + tags.trim().replace(/\s\s*/g, '|').toUpperCase() + ')$');
  }

  /**
   * Set the custom classes to skip.
   * If multiple classes, then use one space ' ' or a pipe '|' as separator.
   * i.e setCustomClassesToSkip('class1 class2') or setCustomClassesToSkip('class1|class2')
   * @param classes Space separated list of classes.
   */
  setCustomClassesToSkip(classes: string | null): void {
    // If the input is either '' or false or null or undefined we reset the variable and return.
    if (!classes) {
      this.skipCustomClasses = null;
      return;
    }
    this.skipCustomClasses = new RegExp('(?:' + classes.trim().replace(/\s\s*/g, '|') + ')');
  }

  /**
   * Get the searched regex.
   */
  getRegex(): string {
    let retval = this.matchRegExp.toString();
    retval = retval.replace(/(^\/(\\b)?|\(|\)|(\\b)?\/i$)/g, '');
    retval = retval.replace(/\|/g, ' ');
    return retval;
  }

  /**
   * Remove highlighting
   */
  remove(): void {
    if (!this.targetNode) {
      return;
    }
    const arr: HTMLCollectionOf<Element> = this.targetNode.getElementsByClassName(this.hiliteClass);
    while (arr.length) {
      const el = arr[0];
      const parent = el.parentNode;
      parent.replaceChild(el.firstChild, el);
      parent.normalize();
    }
  }

  /**
   * Start and apply highlighting at targeted node
   * @param input
   */
  apply(input: string): RegExp {
    this.remove();
    input = input ? input.replace(/(^\s+|\s+$)/g, '') : null;
    if (!input) {
      return;
    }
    if (this.setRegex(input)) {
      this.hiliteWords(this.targetNode);
    }
    return this.matchRegExp;
  }

  /**
   * Setup the regex depending on input.
   * @param input
   * @private
   */
  private setRegex(input): RegExp | boolean {
    input = input.replace(this.endRegExp, '');
    input = input.replace(this.breakRegExp, '|');
    input = input.replace(/^\||\|$/g, '');
    if (input) {
      let re = '(' + input + ')';
      if (!this.openLeft) {
        re = '\\b' + re;
      }
      if (!this.openRight) {
        re = re + '\\b';
      }
      this.matchRegExp = new RegExp(re, 'i');
      return this.matchRegExp;
    }
    return false;
  }

  /**
   * Recursively apply word highlighting
   * @param node
   * @private
   */
  private hiliteWords(node): void {
    if (
      !node ||
      !this.matchRegExp ||
      this.skipTags.test(node.nodeName) ||
      (this.skipCustomTags && this.skipCustomTags.test(node.nodeName)) ||
      (this.skipCustomClasses && this.skipCustomClasses.test(node.className))
    ) {
      return;
    }

    // If there is children inside, we recursively look for words to highlight within.
    if (node.hasChildNodes()) {
      node.childNodes.forEach(childNode => {
        this.hiliteWords(childNode);
      });
    }

    // We only care about text nodes (NODE_TEXT) which correspond to nodeType 3.
    if (node.nodeType === 3) {
      const nv: string = node.nodeValue;
      const regs: RegExpExecArray | null = this.matchRegExp.exec(nv);
      if (nv && regs) {
        const match = document.createElement(this.hiliteTag);
        match.className = this.hiliteClass;
        match.appendChild(document.createTextNode(regs[0]));
        const after = node.splitText(regs.index);
        after.nodeValue = after.nodeValue.substring(regs[0].length);
        node.parentNode.insertBefore(match, after);
      }
    }
  }
}
