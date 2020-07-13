import { Injectable } from '@angular/core';
import { PAGES } from  '../utils/const'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  state: {
    isLogin: boolean,
    isForgotPassword: boolean,
    isCreateAccount: boolean,
    isHelp: boolean,
  };

  constructor() {   };

  setAuthPageState(page: string) {
    this.state = {
      isLogin: page === PAGES.login,
      isForgotPassword: page === PAGES.forgotPassword,
      isCreateAccount: page === PAGES.createAccount,
      isHelp: page === PAGES.createAccount
    };
  }


  getAuthPageState(page: string): boolean {
    if(page === PAGES.login ) {
      return this.state.isLogin
    }
    else if(page === PAGES.createAccount ) {
      return this.state.isCreateAccount
    }
    else if(page === PAGES.forgotPassword ) {
      return this.state.isForgotPassword
    }
    else if(page === PAGES.help ) {
      return this.state.isHelp
    }
  }


}
