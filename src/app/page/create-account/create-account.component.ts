import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }

  loginWithEmailAndPassword() {
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  goToCreateAccount() {
    this.router.navigateByUrl('/create-account');   
  }
  
  goToHelp() {
    this.router.navigateByUrl('/help');   
  }

  signupWithEmailAndPassword() {}
}
