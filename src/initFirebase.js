import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

import { FIREBASE_CONFIG } from "./config";

firebase.initializeApp(FIREBASE_CONFIG);
