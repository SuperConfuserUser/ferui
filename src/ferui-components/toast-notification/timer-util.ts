/**
 * Fui Timer Util class
 * Allow to set a timeout that you can pause|resume|cancel|complete.
 */
export class FuiTimerUtil {
  timerId: number;
  start: number;
  remaining: number;

  constructor(private callback: Function, delay?: number) {
    this.remaining = delay || 0;
    this.resume();
  }

  /**
   * Pause the timer
   */
  pause() {
    clearTimeout(this.timerId);
    this.remaining -= Date.now() - this.start;
  }

  /**
   * Resume the timer
   */
  resume() {
    this.start = Date.now();
    clearTimeout(this.timerId);
    this.timerId = setTimeout(this.callback, this.remaining);
  }

  /**
   * Cancel the timer
   */
  cancel() {
    this.remaining = undefined;
    clearTimeout(this.timerId);
    this.timerId = this.start = undefined;
  }

  /**
   * Cancel the timer and execute the callback function directly.
   */
  complete() {
    this.cancel();
    if (this.callback && typeof this.callback === 'function') {
      this.callback();
    }
  }
}
