import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { AuthenticationSection } from '../../../../IAM/presentation/components/authentication-section/authentication-section';

interface NavOption {
  label: string;
  link: string;
  icon: string;
}

@Component({
  selector: 'app-nav-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    AuthenticationSection,
  ],
  templateUrl: './nav-sidebar.html',
  styleUrl: './nav-sidebar.css',
})
export class NavSidebar {
  options: NavOption[] = [
    { label: 'Dashboard', link: '/dashboard', icon: 'dashboard' },
    { label: 'Clientes', link: '/clients', icon: 'group' },
    { label: 'Vehículos', link: '/cars', icon: 'directions_car' },
    { label: 'Simulador', link: '/simulator', icon: 'calculate' },
    { label: 'Cronogramas', link: '/schedules', icon: 'event_note' },
    { label: 'Configuración', link: '/configuration', icon: 'settings' },
  ];
}
