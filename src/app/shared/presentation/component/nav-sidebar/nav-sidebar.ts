import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthenticationSection } from '../../../../IAM/presentation/components/authentication-section/authentication-section';
import { IamStore } from '../../../../IAM/application/iam.store';

interface NavOption {
  labelKey: string;
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
    TranslatePipe,
  ],
  templateUrl: './nav-sidebar.html',
  styleUrl: './nav-sidebar.css',
})
export class NavSidebar {
  private iamStore = inject(IamStore);

  private allOptions: NavOption[] = [
    { labelKey: 'option.dashboard', link: '/dashboard', icon: 'dashboard' },
    { labelKey: 'option.clients', link: '/clients', icon: 'group' },
    { labelKey: 'option.vehicles', link: '/cars', icon: 'directions_car' },
    { labelKey: 'option.simulator', link: '/simulator', icon: 'calculate' },
    { labelKey: 'option.schedules', link: '/schedules', icon: 'event_note' },
    { labelKey: 'option.help', link: '/help', icon: 'help' },
    { labelKey: 'option.settings', link: '/configuration', icon: 'settings' },
  ];

  /** Un Seller no ve ninguna opción del menú; un Buyer las ve todas. */
  protected readonly options = computed(() => (this.iamStore.isBuyer() ? this.allOptions : []));
}
