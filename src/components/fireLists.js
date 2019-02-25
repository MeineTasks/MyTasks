// import db from "./old_firebaseInit";
import RTDB from "./firebaseInitRTDB";

var Statuses = [];
var FTEs = [];
var usedFTEArr=[];
var Envrmnts = [];
var InnoProjCat = [];
var Owners=[];

// const ListRef = db.collection("DropDowns");
var ListData={};

RTDB.ref("/LISTS/").once("value",querySnapshot => {
  ListData=querySnapshot.val()  
}).then(clb=>{

  //Statuses
  ListData.Statuses.List.split("#").forEach(LstItem => {
    //console.log(user)
    Statuses.push(LstItem);
  });
  // Statuses=Statuses.sort()
  //FTE
  ListData.FTE.List.split("#").forEach(LstItem => {
    //console.log(user)
    FTEs.push(LstItem);
    // if(LstItem!="TBD"){
      usedFTEArr.push(LstItem);
    // }
  });
  
  //usedFTEArr.push("A")
  // usedFTEArr=FTEs
  usedFTEArr[0]="0.00"

  // usedFTEArr.splice(0,0,"0.00")
  // debugger
  //console.log(usedFTEArr)
  // Environments
  ListData.Environments.List.split("#").forEach(LstItem => {
    //console.log(user)
    Envrmnts.push(LstItem);
  });

})
RTDB.ref("/USERS/").orderByChild("isOwner")
.equalTo(true)
.once("value",querySnapshot => {
    function sortUsers(a, b) {
      if (a.Label < b.Label) return -1;
      if (a.Label > b.Label) return 1;
      return 0;
    }
    const queryOBJ = querySnapshot.val();
        for (var prop in queryOBJ) {
          // if (prop!="backlog"){
            Owners.push({Label:queryOBJ[prop].Label,UID:prop})
          // }
        }
    Owners=Owners.sort(sortUsers)
})
    
//   ListRef.doc("FTE")
//   .get()
//   .then(doc => {
//     //console.log(doc.data().List.split("#"))
//     doc
//       .data()
//       .List.split("#")
//       .forEach(LstItem => {
//         //console.log(user)
//         FTEs.push(LstItem);
//       });      
//   });  

// ListRef.doc("Environments")
//   .get()
//   .then(doc => {
//     //console.log(doc.data().List.split("#"))
//     doc
//       .data()
//       .List.split("#")
//       .forEach(LstItem => {
//         //console.log(user)
//         Envrmnts.push(LstItem);
//       });
//   });

  // function sortUsers(a, b) {
  //   if (a.Label < b.Label) return -1;
  //   if (a.Label > b.Label) return 1;
  //   return 0;
  // }

  // db.collection("Users") 
  // .where("isOwner", "==", true)
  // .get()
  // .then(doc => {
  //   doc.forEach(LstItem => {
  //     // console.log(LstItem.data())
  //     // Owners.push(LstItem.data().Label)
  //     if (LstItem.id!="backlog"){
  //       Owners.push({Label:LstItem.data().Label,UID:LstItem.id})
  //     }
  //   })
  //   Owners=Owners.sort(sortUsers)
  // });


 
export default {
  statusesList: Statuses,
  FTEList: FTEs,  
  usedFTEArrList: usedFTEArr,
  // envList: Envrmnts,
  innoProjCat: InnoProjCat,
  OwnersList:Owners

};
