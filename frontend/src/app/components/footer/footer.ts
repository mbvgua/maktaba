import { Component, OnInit, signal, Signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit {
  year: WritableSignal<number> = signal(0);

  ngOnInit(): void {
    this.year.set(new Date().getFullYear());
  }
}
