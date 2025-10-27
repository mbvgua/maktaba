import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-homepage',
  imports: [],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export class Homepage implements AfterViewInit {
  ngAfterViewInit(): void {
    const tabs = document.querySelectorAll<HTMLElement>('.tab');
    const contents = document.querySelectorAll<HTMLElement>('.tab-content');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetId = tab.id.replace('Tab', 'Content');
        const targetContent = document.getElementById(targetId);

        // Hide all content divs
        contents.forEach((content) => content.classList.add('hidden'));

        // Remove active class from all tabs
        tabs.forEach((t) => {
          t.classList.remove('text-purple-700', 'bg-gray-50', 'border-purple-700', 'font-semibold');
          t.classList.add('text-slate-600', 'border-gray-200', 'font-medium');
        });

        // Show the target content (if it exists)
        if (targetContent) {
          targetContent.classList.remove('hidden');
        }

        // Add active class to clicked tab
        tab.classList.add('text-purple-700', 'bg-gray-50', 'border-purple-700', 'font-semibold');
        tab.classList.remove('text-slate-600', 'border-gray-200', 'font-medium');
      });
    });
  }
}
