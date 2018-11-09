import firebase from "firebase";
// import "firebase/firestore";
import firebaseConfig from "./firebaseConfig";

// const firebaseApp = firebase.initializeApp(firebaseConfig);
//firebase.database(); //.settings({timestampsInSnapshots: true})
const firebaseApp = firebase.initializeApp(firebaseConfig);
export default firebaseApp.database();
