import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';


@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, HomeComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {

  public pieData: any[] = [];

  view: [number, number] = [700, 400];
  showLegend = true;
  showLabels = true;
  isDoughnut = false;
  legendPosition = 'below';

}
