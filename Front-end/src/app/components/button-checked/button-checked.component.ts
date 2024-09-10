import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-checked',
  standalone: true,
  imports: [],
  templateUrl: './button-checked.component.html',
  styleUrl: './button-checked.component.css'
})
export class ButtonCheckedComponent {
  @Input() name: string = '';
  @Input() checked: boolean = false;
  @Input() identifier: string = '';

  @Output() checkedChange = new EventEmitter<boolean>();

  onCheckboxChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.checked = inputElement.checked;
    this.checkedChange.emit(this.checked);
  }
}
