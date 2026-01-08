import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageHomeComponent } from './page-home/page-home.component';
import { TemplateHeaderComponent } from './_template/template-header/template-header.component';
import { TemplateHeaderNavComponent } from './_template/template-header-nav/template-header-nav.component';
import { PageSettingsComponent } from './page-settings/page-settings.component';
import { TemplateListHerstellerComponent } from './_template/template-list-hersteller/template-list-hersteller.component';
import { TemplateListMaterialComponent } from './_template/template-list-material/template-list-material.component';
import { PageOrtComponent } from './page-ort/page-ort.component';
import { TemplateListOrtComponent } from './_template/template-list-ort/template-list-ort.component';
import { PageFilamentComponent } from './page-filament/page-filament.component';
import { TemplateListFilamentComponent } from './_template/template-list-filament/template-list-filament.component';
import { PageSpuleComponent } from './page-spule/page-spule.component';
import { TemplateListSpuleComponent } from './_template/template-list-spule/template-list-spule.component';
import { PageMaterialHerstellerComponent } from './page-materialHersteller/page-materialHersteller.component';
import { ToastrModule } from 'ngx-toastr';
import { FilamentFilterComponent } from './shared/filament-filter/filament-filter.component';
import { LegendeComponent } from './shared/legende/legende.component';
import { NoElementComponent } from './shared/no-element/no-element.component';
import { TemplateListOrtSpuleComponent } from './_template/template-list-ort-spule/template-list-ort-spule.component';
import { SortButtonComponent } from './shared/sort-button/sort-button.component';

const navigationRoutes: Routes = [
  {path: 'spulen', component: PageSpuleComponent},
  {path: 'ort', component: PageOrtComponent},
  {path: 'filament', component: PageFilamentComponent},
  {path: 'materialHersteller', component: PageMaterialHerstellerComponent},
  {path: 'einstellungen', component: PageSettingsComponent},
  {path: '', component: PageHomeComponent, pathMatch: 'full'},
  {path: '**', redirectTo: '/'},
]

@NgModule({
  declarations: [								
    AppComponent,
    PageHomeComponent,
    PageSettingsComponent,
    PageOrtComponent,
    PageFilamentComponent,
    PageSpuleComponent,
    PageMaterialHerstellerComponent,
    TemplateHeaderComponent,
    TemplateHeaderNavComponent,
    TemplateListHerstellerComponent,
    TemplateListMaterialComponent,
    TemplateListOrtComponent,
    TemplateListFilamentComponent,
    TemplateListSpuleComponent,
    FilamentFilterComponent,
    LegendeComponent,
    NoElementComponent,
    TemplateListOrtSpuleComponent,
    SortButtonComponent,
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(navigationRoutes),
    MatIconModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSliderModule,
    DragDropModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor (
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    const icons = ['spool', 'manufacturer', 'material', 'nfc', 'nfc-off', 'gewicht']
    
    icons.forEach(icon => {
      matIconRegistry.addSvgIcon(icon,domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icon}.svg`))
    })
  }
}
