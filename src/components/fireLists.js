import db from "./firebaseInit";

var Statuses = [];
var Projects = [];
// var Members=[];

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

ListRef.doc("Project")
  .get()
  .then(doc => {
    //console.log(doc.data().List.split("#"))
    doc
      .data()
      .List.split("#")
      .forEach(LstItem => {
        // console.log(LstItem)
        Projects.push(LstItem);
      });
  });
  // ListRef.doc("TeamMembers")
  // .get()
  // .then(doc => {
  //   //console.log(doc.data().List.split("#"))
  //   doc
  //     .data()
  //     .List.split("#")
  //     .forEach(LstItem => {
  //       //console.log(user)
  //       Members.push(LstItem);
  //     });
  // });
export default {
  statusesList: Statuses,
  projectsList: Projects  
};
