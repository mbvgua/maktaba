import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements AfterViewInit {
  @ViewChild('mobileMenuBtn', { static: true }) mobileMenuBtn!: ElementRef;
  @ViewChild('mobileMenu', { static: true }) mobileMenu!: ElementRef;
  @ViewChild('header', { static: true }) navbar!: ElementRef;

  ngAfterViewInit(): void {
    // Mobile menu toggle
    this.mobileMenuBtn?.nativeElement.addEventListener('click', () => {
      this.mobileMenu?.nativeElement.classList.toggle('hidden');
    });

    // Add some interactive animations
    document.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
      link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-1px)';
      });

      link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0)';
      });
    });
  }

  // scrolling position affect navbar
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    const scrollPosition =
      window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;

    if (scrollPosition == 0) {
      // Reverts to default when at top
      this.navbar.nativeElement.classList.remove(
        'fixed',
        'absolute',
        'inset-x-0',
        'top-0',
        'z-50',
        'mx-auto',
        'w-full',
        'max-w-screen-md',
        'backdrop-blur-lg',
        'md:rounded-3xl',
        'lg:max-w-screen-xl',
        'md:top-3',
        'lg:top-3',
      );
      this.navbar.nativeElement.classList.remove('sticky');
    } else if (scrollPosition > 100) {
      this.navbar.nativeElement.classList.add(
        'fixed',
        'absolute',
        'inset-x-0',
        'top-0',
        'z-50',
        'mx-auto',
        'w-full',
        'max-w-screen-md',
        'backdrop-blur-lg',
        'md:rounded-3xl',
        'lg:max-w-screen-xl',
        'md:top-3',
        'lg:top-3',
      );
      // make navbar sticky and transparent on scroll
      this.navbar.nativeElement.classList.add('sticky');
    }
  }
}
