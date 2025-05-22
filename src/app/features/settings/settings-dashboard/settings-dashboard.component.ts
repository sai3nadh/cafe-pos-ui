import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-dashboard',
  imports: [],
  templateUrl: './settings-dashboard.component.html',
  styleUrl: './settings-dashboard.component.scss'
})
export class SettingsDashboardComponent {
    constructor(private router: Router) {}

 goTo(path: string) {
    if (path.startsWith('/')) {
      this.router.navigate([path]);
    } else {
      this.router.navigate([`/settings/${path}`]);
    }
    // this.router.navigate([`/settings/${path}`]);
  }
}
