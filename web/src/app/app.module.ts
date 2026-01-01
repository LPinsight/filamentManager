import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
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
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(navigationRoutes),
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor (
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    const icons = ['spool', 'manufacturer', 'material']
    
    icons.forEach(icon => {
      matIconRegistry.addSvgIcon(icon,domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icon}.svg`))
    })
  }
}
