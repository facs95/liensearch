import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyCa61N2rKPLU-m7RW-iQ1Xd2G8d2GL0to8",
    authDomain: "lien-search-262720.firebaseapp.com",
    databaseURL: "https://lien-search-262720.firebaseio.com",
    projectId: "lien-search-262720",
    storageBucket: "lien-search-262720.appspot.com",
    messagingSenderId: "45974338820",
    appId: "1:45974338820:web:762f88d7c893541b0ce451"
};


firebase.initializeApp(firebaseConfig);
