import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
// import { Ratings } from '../../models/ratings';
import { AngularFireDatabase } from '@angular/fire/database';

import { COLLECTION } from '../utils/const'

@Injectable()
export class DataService {
  KM: number = 1.60934;
  openModal: boolean = false;

  constructor(
    public angularFireStore: AngularFirestore,
    public angularFireAuth: AngularFireAuth,
    public http: HttpClient,
    public angularFireDatabase: AngularFireDatabase
  ) { }


  getAllFromCollection(collectionName: string): Observable<any> {
    return this.angularFireStore.collection<any>(collectionName).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getDocumentFromCollection(collectionName: string, docId: string): Observable<any> {
    return this.angularFireStore.collection<any>(collectionName).doc(docId).get();
  }

  getCollectionById(collectionName: string, uid: string): Observable<any> {
    return this.angularFireStore.collection<any>(collectionName, !!uid ? ref => ref.where('uid', '==', uid) : null).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getDocumentFromCollectionById(collectionName, id) {
    return this.angularFireStore.collection<any>(collectionName).doc(id).valueChanges();
  }

  getCollectionByKeyValuePair(collectionName: string, key: string, value: string): Observable<any> {
    return this.angularFireStore.collection<any>(collectionName, ref => ref.where(key, '==', value)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  // ========== master add document array ==============

  sortByDistance(data) {
    if (data) {
      return data.sort(function (a, b) {
        return a.distance - b.distance;
      });
    } else {
      return [];
    }
  }

  addUserActionToJobCollection(collection: string, services, newService: any, userId: string) {
    const key = new Date().getTime().toString();
    // this.getDocumentFromCollectionById(collection, newService.id).toPromise().then(services => {
    if (!!services) { //Job is root document eg /viewed-services/jobid 
      if (!this.isUserInJobDocumentArray(services, newService)) { // add job to existing database services
        const newServices = { ...services, [key]: newService };
        this.updateCollection(collection, newServices, newService.id);
      } else { //check if user has rated, then update rating 
        const updatedServices = this.updateRating(services, newService);
        if (updatedServices.updated) {
          const allUpdatedRatings = { ...updatedServices.ratings };
          this.updateCollection(collection, allUpdatedRatings, newService.id);
        }
      }
    } else { //Job is NOT root document eg /viewed-services/otherjobIdNotThisOne
      const newServices = { [key]: newService }; // team = {[var]: '', id: 1}
      this.updateCollection(collection, newServices, newService.id);
    }
  }

  updateRating(ratings: any[], newRating): any {
    let updated = false;
    ratings.forEach(r => {
      if (r.id === newRating.id && newRating.rid === r.rid) {
        updated = true;
        r.rating = newRating.rating;
        return { ratings, updated };
      }
    });
    return { ratings, updated };
  }

  getMyRatedService(services: any[], newService, userId: string) {
    let ratedService = null;

    services.forEach(s => {
      if (s.id === newService.id && userId === s.rid) {
        ratedService = s;
      }
    });
    return ratedService;
  }

  isUserInJobDocumentArray(services: any[], service): any[] {
    return services.find(res => {
      return res.id === service.id && res.rid === service.rid;
    });
  }

  updateCollection(collection, newService, id) {
    this.addNewItemWithId(collection, newService, id);
  }

  calculateRating(ratings): number {
    let totalRate = 0;
    ratings.forEach(r => {
      totalRate += +r.rating;
    });
    const rate = (totalRate / ratings.length).toFixed(2);
    return parseFloat(rate) || 0.0;
  }

  getArrayFromObjectList(obj): any[] {
    return obj ? Object.keys(obj).map((k) => obj[k]) : [];
  }



  // ========== master add document array ==============

  getItemById(collectionName: string, id: string) {
    return this.angularFireStore.collection(collectionName).doc<any>(id).valueChanges();
  }

  updateItem(collectionName: string, data: any, id: string) {
    return this.angularFireStore.collection(collectionName).doc<any>(id).update(data);
  }

  addNewItemWithId(collectionName: string, data: any, id: string) {
    return this.angularFireStore.collection(collectionName).doc<any>(id).set(data);
  }

  addNewItem(collectionName: string, data: any) {
    return this.angularFireStore.collection(collectionName).add(data);
  }

  removeItem(collectionName: string, id: string) {
    return this.angularFireStore.collection(collectionName).doc<any>(id).delete();
  }

  findItemById(collectionName: string, id: string) {
    return this.getItemById(collectionName, id);
  }

  getUserById(id): Observable<any> {
    return this.getItemById(COLLECTION.users, id);
  }

  getUserByIdPromise(id) {
    return this.getItemById(COLLECTION.users, id).toPromise();
  }

  getChats(rootCollection: string, receiverUid: string, senderUid: string) {
    return this.angularFireStore.collection(rootCollection).doc(receiverUid).collection(senderUid, ref => ref.orderBy('date')).valueChanges();
  }

  getMyChats(rootCollection: string, senderUid: string) {
    return this.angularFireStore.collection(rootCollection).doc(senderUid).snapshotChanges();
  }

  generateOTPCode(length: number): string { //must be 15 + timestamp
    let result = '';
    const characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  getTimestampInMilliseconds(): string {
    return new Date().getTime().toString();
  }


  // ===== HELPERS ======

  isUserVerified(): boolean {
    if( this.angularFireAuth && this.angularFireAuth.currentUser) {
      this.angularFireAuth.currentUser.then(u => u.emailVerified);
    } else {
      return false;
    }
  }
  getShortDescription(sentence: string, length: number = 13): string {
    const MAX = length;
    const sentenceArray = sentence.split(" ");
    return sentenceArray.length >= MAX ? sentenceArray.splice(0, MAX).join(" ") + ' ...' : sentenceArray.splice(0, sentenceArray.length).join(" ");
  }

  capitalizeFirstLetter(word: string): string {
    return word[0].toUpperCase() + word.slice(1, word.length);
  }

  getOTPCode() {
    return Math.floor(Math.random() * 90000) + 10000;
  }

  cleanPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\(/, '').replace(/\)/, '').replace(/\ /, '').replace(/\ /, '');
  }


  getUserRating(ratings: any[]): string {
    let myRating: number = 0.0;
    ratings.map(r => {
      myRating += r.rating;
    });
    const rating = myRating / ratings.length;
    return (Math.round(rating * 100) / 100).toFixed(1);
  }

  alreadyRated(allRatings, rating) {
    const res = allRatings.filter(r => r.uid === rating.uid && r.rid === rating.rid);
    return res.length > 0;
  }

  mapJobs(allJobs: any[], jobsToBeMapped: any[]): any[] {
    let mappedJobs = [];
    jobsToBeMapped.forEach(j => {
      allJobs.forEach(job => {
        if (job.id === j.id) {
          mappedJobs.push(Object.assign(job, j));
        }
      });
    });
    return mappedJobs;
  }


  countJobOccurrence(array, id): any[] {
    return array.filter(j => j.jid === id);
  }

  removeDuplicates(array, key: string) {
    return array.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[key]).indexOf(obj[key]) === pos;
    });
  }

  getClients() {
    return this.http.get('assets/clients.json').toPromise();
  }

  // getCategories() {
  //   const tasksRef = this.angularFireDatabase.list('/appData');
  //   return tasksRef.snapshotChanges().pipe(
  //     map(changes =>
  //       changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
  //     )
  //   );
  // }

  getCompanies() {
    return this.http.get('assets/companies.json').toPromise();
  }

  getCountries() {
    return this.http.get('assets/countries.json').toPromise();
  }

  getDateTime(): string {
    return moment(new Date()).format('YYYY/MM/DD HH:mm:ss');
  }

  getDateTimeMoment(dateTime): string {
    return moment(dateTime).fromNow();
  }

  // ===== HELPERS ======

  // isRegistered(users, phone): boolean {
  //   let isRegistered = false;
  //   users.forEach(u => {
  //     if (u.signupMethod === SIGNUP_TYPE.phoneNumber
  //       && (u.phone.number.includes(phone.number) || phone.number.includes(u.phone.number))
  //       && u.phone.code.includes(phone.code)) {
  //       isRegistered = true;
  //     }
  //   });
  //   return isRegistered;
  // }

  addItemToLocalStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getItemFromLocalStorage(key: string): any {
    const data = localStorage.getItem(key);
    if (!data || data === 'undefined' || data === null || data === undefined) {
      return {};
    } else {
      return JSON.parse(data);
    }
  }

  applyHaversine(jobs, lat, lng) {
    if (jobs && lat && lng) {
      let usersLocation = {
        lat: lat,
        lng: lng
      };
      jobs.map(job => {
        let placeLocation = {
          lat: job.location.geo.lat,
          lng: job.location.geo.lng
        };
        job.distance = this.getDistanceBetweenPoints(
          usersLocation,
          placeLocation,
          'miles'
        ).toFixed(0);
      });
      return jobs;
    } else {
      return jobs;
    }
  }

  getDistanceBetweenPoints(start, end, units) {
    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'miles'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d * this.KM; //convert miles to km
  }

  toRad(x) {
    return x * Math.PI / 180;
  }

}