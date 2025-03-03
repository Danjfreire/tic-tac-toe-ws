import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  pure: true,
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(seconds: number): string {
    if (seconds === null || seconds === undefined || isNaN(seconds)) {
      return '00:00';
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Add leading zero if needed
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const displaySeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${displayMinutes}:${displaySeconds}`;
  }
}
