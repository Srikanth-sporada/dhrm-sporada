import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {
transform(value: string): string {
    // Return empty if the input is not valid
    if (!value || typeof value !== 'string') {
      return '';
    }

    // Split the string into hours, minutes, and seconds
    const [hours, minutes,seconds] = value.split(':');

    // Convert hours from string to number
    const hoursNum = parseInt(hours, 10);

    // Check for invalid number after parsing
    if (isNaN(hoursNum)) {
        return value; // Or return an error string
    }
    
    // Determine AM or PM
    const ampm = hoursNum >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format
    let hours12 = hoursNum % 12;
    hours12 = hours12 ? hours12 : 12; // The hour '0' should be '12'
    
    // Return the formatted string
    return `${hours12}:${minutes}:${seconds} ${ampm}`;
  }


}
