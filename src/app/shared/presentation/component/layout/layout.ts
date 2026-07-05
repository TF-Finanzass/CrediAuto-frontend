import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { NavSidebar } from '../nav-sidebar/nav-sidebar';
import { IamStore } from '../../../../IAM/application/iam.store';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, NavSidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private iamStore = inject(IamStore);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  private readonly hideSidebarByRouteData = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.deepestRouteData()['hideLayoutSidebar'] === true),
      startWith(this.deepestRouteData()['hideLayoutSidebar'] === true),
    ),
    { initialValue: false },
  );

  private deepestRouteData(): Record<string, unknown> {
    let route = this.activatedRoute.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.data;
  }

  private readonly isAuthRoute = computed(() => {
    const url = this.currentUrl();
    return url.startsWith('/sign-in') || url.startsWith('/sign-up');
  });

  /** Oculta el sidebar en sign-in/sign-up, en rutas marcadas con data.hideLayoutSidebar (ej. 404), o sin sesión activa. */
  protected readonly showSidebar = computed(
    () => this.iamStore.isSignedIn() && !this.isAuthRoute() && !this.hideSidebarByRouteData(),
  );

  protected readonly isAuthRouteForPadding = this.isAuthRoute;
}
