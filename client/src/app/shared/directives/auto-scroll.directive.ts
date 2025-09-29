import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { timer } from 'rxjs';

@Directive({
    selector: '[appAutoScroll]'
})
export class AutoScrollDirective implements OnChanges {
    @Input() appAutoScroll: any; // E.g. messages array
    @Input() delay = 100;

    constructor(private el: ElementRef<HTMLElement>) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['appAutoScroll']) {
            timer(this.delay).subscribe(() => {
                const container = this.el.nativeElement;
                container.scrollTop = container.scrollHeight;
            });
        }
    }
}
