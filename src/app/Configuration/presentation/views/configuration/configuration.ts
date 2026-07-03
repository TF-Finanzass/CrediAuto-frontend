import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationStore } from '../../../application/configuration.store';
import { Currency } from '../../../domain/model/currency';

@Component({
  selector: 'app-configuration',
  imports: [MatButtonToggleModule],
  templateUrl: './configuration.html',
  styleUrl: './configuration.css',
})
export class Configuration {
  readonly store = inject(ConfigurationStore);
  private readonly translate = inject(TranslateService);

  protected readonly Currency = Currency;
  protected currentLang: string = this.translate.getCurrentLang();
  protected languages: string[] = ['en', 'es'];

  useLanguage(language: string): void {
    this.translate.use(language);
    this.currentLang = language;
  }
}
