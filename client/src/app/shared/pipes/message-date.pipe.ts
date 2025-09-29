import { Pipe, PipeTransform } from '@angular/core';
import { format, isToday, isYesterday, isThisYear } from 'date-fns';
import { he } from 'date-fns/locale';

@Pipe({
    name: 'messageDate'
})
export class MessageDatePipe implements PipeTransform {
    transform(timestamp: Date | string): string {
        const date = new Date(timestamp);

        if (isToday(date)) {
            return format(date, 'HH:mm', { locale: he });
        }

        if (isYesterday(date)) {
            return `אתמול, ${format(date, 'HH:mm', { locale: he })}`;
        }

        if (isThisYear(date)) {
            return format(date, 'd בMMM, HH:mm', { locale: he });
        }

        return format(date, 'd בMMM yyyy, HH:mm', { locale: he });
    }
}
