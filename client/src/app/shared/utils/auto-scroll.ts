import { timer } from 'rxjs';

export function scrollToBottom(selector: string, delay = 100) {
    timer(delay).subscribe(() => {
        const container = document.querySelector(selector);
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    });
}
