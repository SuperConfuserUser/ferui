import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'fuiSafeHtml' })
export class FuiSafeHTMLPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(style) {
    return this.sanitizer.bypassSecurityTrustHtml(style);
  }
}
