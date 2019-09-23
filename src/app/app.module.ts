import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from '@src/app/in-memory-data.service';
// import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppComponent } from '@src/app/app.component';
import { AppRoutingModule } from '@src/app/app-routing.module';
import { DashboardComponent } from '@src/app/dashboard/dashboard.component';
import { HeroesComponent } from '@src/app/heroes/heroes.component';
import { HeroDetailComponent } from '@src/app/hero-detail/hero-detail.component';
import { HeroSearchComponent } from '@src/app/hero-search/hero-search.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
      dataEncapsulation: false,
      delay: 300,
      passThruUnknownUrl: true
    })
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    HeroSearchComponent,
    HeroesComponent,
    HeroDetailComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
