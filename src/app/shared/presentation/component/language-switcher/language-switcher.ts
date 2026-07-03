import {Component, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';

@Component({
  selector: 'app-language-switcher',
  imports: [
    MatButtonToggleGroup,
    MatButtonToggle
  ],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css'
})
export class LanguageSwitcher {
  // Idioma actualmente seleccionado
  protected currentLang: string = 'en';

  // Lista de idiomas disponibles en la app
  protected languages: string[] = ['en', 'es'];

  // Instancia del servicio de traducciones (@ngx-translate/core)
  private translate: TranslateService;

  constructor() {
    this.translate = inject(TranslateService);

    // Sincroniza el idioma activo con el que ya tiene el servicio
    this.currentLang = this.translate.getCurrentLang();
  }

  // Cambia el idioma de toda la app y actualiza el botón seleccionado
  useLanguage(language: string) {
    this.translate.use(language);     // Cambia el idioma globalmente
    this.currentLang = language;      // Actualiza el botón activo visualmente
  }
}
