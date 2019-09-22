import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';
import { DashboardComponent } from '@src/app/dashboard/dashboard.component';


export const routes: Routes = [
  {
      path: '',
      redirectTo: '/dashboard',
      pathMatch: 'full',
  },
  {
      path: 'dashboard',
      component: DashboardComponent,
  },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
