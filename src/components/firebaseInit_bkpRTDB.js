import firebase from "firebase";
// import "firebase/firestore";
// import firebaseConfig from "./firebaseConfig";

// const firebaseApp = firebase.initializeApp(firebaseConfig);
//firebase.database(); //.settings({timestampsInSnapshots: true})
const firebaseBKPApp = firebase.initializeApp(
  {
    apiKey: "AIzaSyCxwLxsrrkXzRTvhkXHnq5uUz9In7GxHtA",
    authDomain: "bkpmytasks.firebaseapp.com",
    databaseURL: "https://bkpmytasks.firebaseio.com",
    projectId: "bkpmytasks",
    storageBucket: "",
    messagingSenderId: "807977063811",
    appId: "1:807977063811:web:051f5723b0d1a774"
  },
  "bkp"
);
export default firebaseBKPApp.database();
