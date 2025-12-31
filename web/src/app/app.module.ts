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

const navigationRoutes: Routes = [
  {path: 'spulen', component: PageHomeComponent},
  {path: 'ort', component: PageHomeComponent},
  {path: 'filament', component: PageHomeComponent},
  {path: 'material', component: PageHomeComponent},
  {path: 'hersteller', component: PageHomeComponent},
  {path: 'einstellungen', component: PageSettingsComponent},
  {path: '', component: PageHomeComponent, pathMatch: 'full'},
  {path: '**', redirectTo: '/'},
]

@NgModule({
  declarations: [		
    AppComponent,
    PageHomeComponent,
    PageSettingsComponent,
    TemplateHeaderComponent,
    TemplateHeaderNavComponent,
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
