import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'layout-component',
  templateUrl: './layout.component.html'
})

export class LayoutComponent {
  constructor(private router: Router) {}

  onLogoClick(): void {
    if (this.router.url === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.router.navigate(['/']).then((): void => window.scrollTo({ top: 0, behavior: 'smooth'}));
    }
  }

  scrollToSection(sectionId: string): void {
    if (this.router.url !== '/' && !this.router.url.startsWith('/#')) {
      this.router.navigate(['/'], { fragment: sectionId }).then((): void => {
        setTimeout((): void => {
          const element: HTMLElement | null = document.getElementById(sectionId);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      });
    } else {
      const element: HTMLElement | null = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  }

}
