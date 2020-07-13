import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import 'hammerjs';

import { AuthService } from './services/auth.service';
 
import { AppComponent } from './app.component';
import { LoginComponent } from './page/login/login.component';
import { CreateAccountComponent } from './page/create-account/create-account.component';
import { ForgotPasswordComponent } from './page/forgot-password/forgot-password.component';
import { HelpComponent } from './page/help/help.component';
import { LogoComponent } from './shared/logo/logo.component';
import { JobsComponent } from './jobs/jobs.component';

import { firebaseConfig } from './firebase.config';
import { MaterialModule } from './material.module';
import { AppRoutingModule} from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { DataService } from './services/data.service';
import { FirebaseAuthService } from './services/firebase-auth.service';
import {NgxMatIntlTelInputModule,} from 'ngx-mat-intl-tel-input';

 
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateAccountComponent,
    ForgotPasswordComponent,
    HelpComponent,
    LogoComponent,
    JobsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig),
    NgxMatIntlTelInputModule,

  ],
  providers: [
    AuthService,
    FirebaseAuthService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
