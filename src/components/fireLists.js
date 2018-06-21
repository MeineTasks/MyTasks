import db from "./firebaseInit";

var Statuses = [];
var FTEs = [];
var Envrmnts = [];
var InnoProjCat = [];
var Owners=[];

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
      Statuses=Statuses.sort()
  });
  ListRef.doc("FTE")
  .get()
  .then(doc => {
    //console.log(doc.data().List.split("#"))
    doc
      .data()
      .List.split("#")
      .forEach(LstItem => {
        //console.log(user)
        FTEs.push(LstItem);
      });      
  });  

ListRef.doc("Environments")
  .get()
  .then(doc => {
    //console.log(doc.data().List.split("#"))
    doc
      .data()
      .List.split("#")
      .forEach(LstItem => {
        //console.log(user)
        Envrmnts.push(LstItem);
      });
  });

  db.collection("Users") 
  .where("isOwner", "==", true)
  .get()
  .then(doc => {
    doc.forEach(LstItem => {
      // console.log(LstItem.data())
      // Owners.push(LstItem.data().Label)
      Owners.push({Label:LstItem.data().Label,UID:LstItem.id})
    })
    //Owners=Owners.sort()
  });


 
export default {
  statusesList: Statuses,
  FTEList: FTEs,  
  envList: Envrmnts,
  innoProjCat: InnoProjCat,
  OwnersList:Owners
};
