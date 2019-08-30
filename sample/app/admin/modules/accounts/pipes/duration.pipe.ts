import { Pipe, PipeTransform } from '@angular/core';
import { differenceInSeconds } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import { duration } from '@firestitch/date';


@Pipe({name: 'dateDuration'})
export class DateDurationPipe implements PipeTransform {
  transform(date1, date2) {

    date1 = parseISO(date1);
    date2 = parseISO(date2);

    const seconds = differenceInSeconds(date1, date2);

    return duration(seconds, { hours: true, minutes: true, days: true });
  }
}
