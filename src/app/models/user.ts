// import { Phone } from "./phone";
// import { UserLocation } from "./location";

export interface User {
    id?: string;
    uid: string;
    email?: string;
    password?: string;
    phone: any;
    firstname: string;
    lastname: string;
    dob: string;
    gender: string;
    race: string;
    type: string;
    location: any;
    dateCreated: string;
    status: string;
    signupMethod: string;
}

export interface Activity {
    uid: string;
    oid: string;
    sid: string;
    date: string;
}

export interface UserStatus {
    isVerified: boolean,
    text: string;
}
