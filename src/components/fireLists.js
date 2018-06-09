import db from "./firebaseInit";

var Statuses = [];
var Projects = [];
var MyProjects = [];
var Envrmnts = [];
var InnoProj = [];
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
ListRef.doc("MyProjects")
  .get()
  .then(doc => {
    //console.log(doc.data().List.split("#"))
    doc
      .data()
      .List.split("#")
      .forEach(LstItem => {
        //console.log(user)
        MyProjects.push(LstItem);
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
db.collection("DropDowns/InnoPipeline/Projects")
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(doc => {
      doc.data().Projects.forEach(prj => {
        InnoProj.push(prj);
      });
    });
    InnoProj.sort()
  });

function sortTasks(a, b) {
  if (a.task_deadline < b.task_deadline) return -1;
  if (a.task_deadline > b.task_deadline) return 1;
  return 0;
}
 
export default {
  statusesList: Statuses.sort(),
  projectsList: Projects,
  myProjectsList: MyProjects,
  envList: Envrmnts,
  inoProj: InnoProj
};
