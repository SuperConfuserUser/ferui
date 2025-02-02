// @dynamic
export class FeruiUtils {
  protected static isSafari: boolean;
  protected static isIE: boolean;
  protected static isEdge: boolean;
  protected static isChrome: boolean;
  protected static isFirefox: boolean;

  protected constructor() {}

  static isBrowserChrome(): boolean {
    if (this.isChrome === undefined) {
      const win = window as any;
      this.isChrome =
        (!!win.chrome && (!!win.chrome.webstore || !!win.chrome.runtime)) ||
        (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor));
    }
    return this.isChrome;
  }

  static isBrowserFirefox(): boolean {
    if (this.isFirefox === undefined) {
      const win = window as any;
      this.isFirefox = typeof win.InstallTrigger !== 'undefined';
    }
    return this.isFirefox;
  }

  static isBrowserSafari(): boolean {
    if (this.isSafari === undefined) {
      const anyWindow = window as any;
      // taken from https://github.com/ag-grid/ag-grid/issues/550
      this.isSafari =
        Object.prototype.toString.call(anyWindow.HTMLElement).indexOf('Constructor') > 0 ||
        (function (p) {
          return p ? p.toString() === '[object SafariRemoteNotification]' : false;
        })(!anyWindow.safari || anyWindow.safari.pushNotification);
    }
    return this.isSafari;
  }

  /**
   * https://stackoverflow.com/questions/24004791/can-someone-explain-the-debounce-function-in-javascript
   */
  static debounce(func: () => void, wait: number, immediate: boolean = false) {
    // 'private' variable for instance
    // The returned function will be able to reference this due to closure.
    // Each call to the returned function will share this common timer.
    let timeout: any;

    // Calling debounce returns a new anonymous function
    return function (...args: any[]) {
      // reference the context and args for the setTimeout function
      // tslint:disable-next-line
      const context = this;

      // Should the function be called now? If immediate is true
      //   and not already in a timeout then the answer is: Yes
      const callNow = immediate && !timeout;

      // This is the basic debounce behaviour where you can call this
      //   function several times, but it will only execute once
      //   [before or after imposing a delay].
      //   Each time the returned function is called, the timer starts over.
      window.clearTimeout(timeout);

      // Set the new timeout
      timeout = window.setTimeout(function () {
        // Inside the timeout function, clear the timeout variable
        // which will let the next execution run when in 'immediate' mode
        timeout = null;

        // Check if the function already ran with the immediate flag
        if (!immediate) {
          // Call the original function with apply
          // apply lets you define the 'this' object as well as the arguments
          //    (both captured before setTimeout)
          func.apply(context, args);
        }
      }, wait);

      // Immediate mode and no wait timer? Execute the function..
      if (callNow) {
        func.apply(context, args);
      }
    };
  }

  static clearElement(el: HTMLElement): void {
    while (el && el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  static missing(value: any): boolean {
    return !this.exists(value);
  }

  static exists(value: any, allowEmptyString: boolean = false): boolean {
    return value != null && (value !== '' || allowEmptyString);
  }

  static missingOrEmpty(value: any[] | string | undefined): boolean {
    return !value || this.missing(value) || value.length === 0;
  }

  static isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }

  static mergeObjects(object1, object2): object {
    return object2 ? { ...object1, ...object2 } : object1;
  }

  static mergeDeep<T>(target: T, source: T): T {
    const isObject = obj => obj && typeof obj === 'object';

    if (!isObject(target) || !isObject(source)) {
      return source;
    }

    Object.keys(source).forEach(key => {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        target[key] = targetValue.concat(sourceValue);
      } else if (isObject(targetValue) && isObject(sourceValue)) {
        target[key] = this.mergeDeep(Object.assign({}, targetValue), sourceValue);
      } else {
        target[key] = sourceValue;
      }
    });

    return target;
  }

  static flattenObject<T>(object: T): any[] {
    if (!object) {
      return null;
    }
    const array = [];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        array.push(object[key]);
      }
    }
    return array;
  }

  static isNumeric(value: any): boolean {
    if (value === '' || value === null || value === undefined) {
      return false;
    }
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  /**
   * Check whether or not an object is empty. If object in null or undefined, this method will return true.
   * @param object
   */
  static isObjectEmpty(object: any) {
    return FeruiUtils.isNullOrUndefined(object) || (Object.keys(object).length === 0 && object.constructor === Object);
  }

  static toStringOrNull(value: any): string | null {
    if (this.exists(value) && value.toString) {
      return value.toString();
    } else {
      return null;
    }
  }

  static inRange(value: number, min: number, max: number) {
    return value >= min && value <= max;
  }

  static generateUniqueId(prefix: string = 'fui', separator: string = '-'): string {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return prefix + separator + Math.random().toString(36).substr(2, 9);
  }

  static iterateObject<T>(object: { [p: string]: T } | T[] | undefined, callback: (key: string, value: T) => void) {
    if (!object || this.missing(object)) {
      return;
    }

    if (Array.isArray(object)) {
      object.forEach((value, index) => {
        callback(index + '', value);
      });
    } else {
      const keys = Object.keys(object);
      for (const key of keys) {
        const value = object[key];
        callback(key, value);
      }
    }
  }

  static cloneObject<T>(object: T): T {
    const copy = {};
    const keys = Object.keys(object);
    for (const key of keys) {
      copy[key] = (object as any)[key];
    }
    return copy as T;
  }

  static deepCloneObject<T>(object: T): T {
    return JSON.parse(JSON.stringify(object));
  }

  static assign(object: any, ...sources: any[]): any {
    sources.forEach(source => {
      if (this.exists(source)) {
        this.iterateObject(source, function (key: string, value: any) {
          object[key] = value;
        });
      }
    });

    return object;
  }

  static isEqual(value: any[] | Object, other: any[] | Object): boolean {
    // Get the value type
    const type: string = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) {
      return false;
    }

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) {
      return false;
    }

    // Compare the length of the length of the two items
    const valueLen: number = type === '[object Array]' && value instanceof Array ? value.length : Object.keys(value).length;
    const otherLen: number = type === '[object Array]' && other instanceof Array ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) {
      return false;
    }

    // Compare two items
    const compare = (item1: any[] | Object, item2: any[] | Object) => {
      // Get the object type
      const itemType: string = Object.prototype.toString.call(item1);
      // If an object or array, compare recursively
      if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
        if (!this.isEqual(item1, item2)) {
          return false;
        }
      } else {
        // Otherwise, do a simple comparison
        // If the two items are not the same type, return false
        if (itemType !== Object.prototype.toString.call(item2)) {
          return false;
        }
        // Else if it's a function, convert to a string and compare
        // Otherwise, just compare
        if (itemType === '[object Function]') {
          if (item1.toString() !== item2.toString()) {
            return false;
          }
        } else {
          if (item1 !== item2) {
            return false;
          }
        }
      }
    };

    // Compare properties
    if (type === '[object Array]') {
      for (let i = 0; i < valueLen; i++) {
        if (compare(value[i], other[i]) === false) {
          return false;
        }
      }
    } else {
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          if (compare(value[key], other[key]) === false) {
            return false;
          }
        }
      }
    }

    // If nothing failed, return true
    return true;
  }

  /**
   * Check if a key exist in a specified object.
   * @param object The object where you expect to find the key in.
   * @param key The key you're looking for.
   * @param allowNullValues Default to true; Whether or not we also check if the value of object key is not null nor undefined.
   */
  static isKeyExistIn(object: object, key: string | number, allowNullValues: boolean = true) {
    if (FeruiUtils.isNullOrUndefined(object) || (!FeruiUtils.isNullOrUndefined(object) && FeruiUtils.isObjectEmpty(object))) {
      return false;
    }
    return allowNullValues ? key in object : key in object && !FeruiUtils.isNullOrUndefined(object[key]);
  }

  /**
   * This is equivalent to jQuery `$(jqObject).closest(className)` method.
   * We try to get the closest element that contains the desired class and travel up the DOM to find it.
   * @param domElement
   * @param domClass
   * @returns Element | null
   */
  static getClosestDomElement(domElement: Element, domClass: string): Element | null {
    if (!domElement || !domElement.classList) {
      return null;
    }
    if (!domElement.classList.contains(domClass)) {
      const parent: Element = domElement.parentElement;
      return FeruiUtils.getClosestDomElement(parent, domClass);
    } else {
      return domElement;
    }
  }

  // this is the trick: we create a dummy container and clone all the cells
  // into the dummy, then check the dummy's width. then destroy the dummy
  // as we don't need it any more.
  static getPreferredWidthForItem(htmlElement: HTMLElement, bodyContainer: HTMLElement, extraSize: number = 0): number {
    function cloneItemIntoDummy(element: HTMLElement, dummyContainer: HTMLElement): void {
      // make a deep clone of the cell
      const eItemClone: HTMLElement = element.cloneNode(true) as HTMLElement;
      // the original has a fixed width, we remove this to allow the natural width based on content
      eItemClone.style.width = '';
      // the original has position = absolute, we need to remove this so it's positioned normally
      eItemClone.style.position = 'static';
      eItemClone.style.left = '';
      // we put the cell into a containing div, as otherwise the cells would just line up
      // on the same line, standard flow layout, by putting them into divs, they are laid
      // out one per line
      const eCloneParent = document.createElement('div');
      // table-row, so that each cell is on a row. i also tried display='block', but this
      // didn't work in IE
      eCloneParent.style.display = 'table-row';

      // the twig on the branch, the branch on the tree, the tree in the hole,
      // the hole in the bog, the bog in the clone, the clone in the parent,
      // the parent in the dummy, and the dummy down in the vall-e-ooo, OOOOOOOOO! Oh row the rattling bog....
      eCloneParent.appendChild(eItemClone);
      dummyContainer.appendChild(eCloneParent);
    }

    const eDummyContainer = document.createElement('span');
    // position fixed, so it isn't restricted to the boundaries of the parent
    eDummyContainer.style.position = 'fixed';

    // we put the dummy into the body container, so it will inherit all the
    // css styles that the real items are inheriting
    bodyContainer.appendChild(eDummyContainer);

    // get all the items that are currently displayed
    cloneItemIntoDummy(htmlElement, eDummyContainer);

    // at this point, all the clones are lined up vertically with natural widths. the dummy
    // container will have a width wide enough just to fit the largest.
    const dummyContainerWidth: number = eDummyContainer.offsetWidth;

    // we are finished with the dummy container, so get rid of it
    bodyContainer.removeChild(eDummyContainer);

    return dummyContainerWidth + extraSize;
  }
}
