import { HttpClientModule } from "@angular/common/http";
import { ToastrModule } from "ngx-toastr";
import { AppComponent } from "./app.component";
import { RouterOutlet } from "@angular/router";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID, NgModule } from "@angular/core";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { registerLocaleData } from "@angular/common";
import localePt from '@angular/common/locales/pt';
import { NgxFileDropModule } from "ngx-file-drop";
import { NgApexchartsModule } from "ng-apexcharts";
import { SharedModule } from "./shared/shared.module";
import { OAuthModule } from "angular-oauth2-oidc";
import { LayoutsModule } from "./core/layouts/layouts.module";
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from "./main-layout.component";
import { AppRoutingModule } from "./app-routes";

registerLocaleData(localePt, 'pt-BR');

@NgModule({
	declarations: [
		AppComponent,
		MainLayoutComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		RouterOutlet,
		AppRoutingModule,
		ToastrModule.forRoot(),
		NgxFileDropModule,
		NgApexchartsModule,
		SharedModule,
		LayoutsModule,
		RouterModule,
		OAuthModule.forRoot()
	],
	providers: [	
    provideAnimationsAsync(),
	{ provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
	bootstrap: [AppComponent],
})
export class AppModule { }
