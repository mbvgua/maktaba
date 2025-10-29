import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  @ViewChild('password', { static: true }) passwordSvg!: ElementRef;

  togglePasswordVisibility() {
    /*
     * this function is supposed to toggle password visibility on and off
     * on click, alternate between:
     *      - input type to text -> svg hide password
     *      - input type to password -> svg show password
     */
    //this.passwordSvg?.nativeElement.classList.toggle('text');
    console.log("ayeee")
  }
}
