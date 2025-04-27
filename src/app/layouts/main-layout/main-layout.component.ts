import { Component } from '@angular/core';
import { TopBarComponent } from "../../shared/components/top-bar/top-bar.component";
import { RouterModule } from '@angular/router'; // ✅ add this
import { CommonModule } from '@angular/common';
import { HeaderEventsService } from '../../features/services/header-events.service';

@Component({
  selector: 'app-main-layout',
  imports: [TopBarComponent,
    RouterModule,
    CommonModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

  topBarHeight = 0;

  onTopBarHeight(height: number) {
    this.topBarHeight = height;
    // alert("height"+height);
    this.headerEventsService.setTopBarHeight(height); // 👈 Share height globally

  }

  showTopBar = true;
  constructor(private headerEventsService: HeaderEventsService) {
    this.headerEventsService.showTopBar$.subscribe(show => {
      this.showTopBar = show;
    });
  }

}
