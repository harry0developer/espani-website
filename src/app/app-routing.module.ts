import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './page/login/login.component';
import { CreateAccountComponent } from './page/create-account/create-account.component';
import { ForgotPasswordComponent } from './page/forgot-password/forgot-password.component';
import { HelpComponent } from './page/help/help.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '*', redirectTo: 'login'},


  {path: '**', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'create-account', component: CreateAccountComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'help', component: HelpComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
