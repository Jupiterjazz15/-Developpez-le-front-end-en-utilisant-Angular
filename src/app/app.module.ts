import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DetailComponent } from './pages/detail/detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// pour ne pas avoir d'animation pour mon  graph en ligne


@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, HomeComponent, DetailComponent,NoopAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
