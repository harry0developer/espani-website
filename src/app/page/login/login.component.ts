import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import {FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  data = {
    email: '',
    password: ''
  };
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
  ]);

  phoneFormControl = new FormControl('', [
    Validators.required,
  ]);

  matcher = new MyErrorStateMatcher();
  public phoneForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private firebaseAuthService: FirebaseAuthService) { 
    this.phoneForm = this.formBuilder.group({
      phone: ['', Validators.required]
    });
  }

  ngOnInit() { }

  loginWithEmailAndPassword() {
    console.log(this.data);
    this.firebaseAuthService.signInWithEmailAndPassword(this.data.email, this.data.password).then(r => {
      console.log(r);
    }).catch(err => {
      console.log(err);
    })
  }

  goToForgotPassword() {
    this.router.navigateByUrl('/forgot-password');
  }
  
  goToCreateAccount() {
    this.router.navigateByUrl('/create-account');
  }
  
  goToHelp() {
    this.router.navigateByUrl('/help');   
  }
  yourComponentMethodToTreatyCountryChangedEvent(e) {
    console.log(e);
    
  } 
}
