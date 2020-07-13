import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { DataService } from './data.service'; 

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  constructor(
    public angularFireAuth: AngularFireAuth,
    public angularFireStore: AngularFirestore,
    public dataService: DataService,
  ) { }

  googleAuth() {
    return this.authLogin(new auth.GoogleAuthProvider());
  }

  signInWithTwitter() {
    return this.authLogin(new auth.TwitterAuthProvider());
  }

  signInWithFacebook() {
    return this.authLogin(new auth.FacebookAuthProvider());
  }

  authLogin(provider) {
    return this.angularFireAuth.signInWithPopup(provider);
  }

  signInWithPhoneNumber(phoneNumber: string, verifier: auth.ApplicationVerifier) {
    return this.angularFireAuth.signInWithPhoneNumber(phoneNumber, verifier);
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }

  signUpWithEmailAndPassword(email: string, password: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password);
  }

  addUserToDatabase(user) {
    return this.angularFireStore.collection('users').doc(user.uid).set(user);
  }

  sendVerificationMail() {
    return this.angularFireAuth.currentUser.then(u => {
      u.sendEmailVerification();
    }).catch(err => {
      console.log(err);
      
    });
  }

  forgotPassword(email: string) {
    return this.angularFireAuth.sendPasswordResetEmail(email);
  }

  logout() {
    // localStorage.removeItem(STORAGE_KEY.user);
    return this.angularFireAuth.signOut();
  }

  getStoredUser(): any {
    const user = localStorage.getItem('user');
    return user !== 'undefined' ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getStoredUser();
  }

  signOut() {
    localStorage.removeItem('user');
    return this.angularFireAuth.signOut();
  }

}
