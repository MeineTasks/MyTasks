import db from "./firebaseInit";


var Statuses = [];

const ListRef = db.collection("DropDowns");



ListRef.doc("Statuses")
  .get()
  .then(doc => {
    //console.log(doc.data().List.split("#"))
    doc
      .data()
      .List.split("#")
      .forEach(LstItem => {
        //console.log(user)
        Statuses.push(LstItem);
      });
  });


export default {  
  statusesList:Statuses  
};
