import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  @ViewChild('verifyModal', { static: true }) modal!: ElementRef;

  showModal() {
    this.modal.nativeElement.classList.toggle('hidden');
    console.log('show modal now!');
  }

  hideModal() {
    this.modal.nativeElement.classList.toggle('hidden');
    console.log('hide modal now!');
  }
}
