import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavSidebar } from '../nav-sidebar/nav-sidebar';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    NavSidebar,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
