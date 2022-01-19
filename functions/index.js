const functions = require("firebase-functions");
const admin = require("firebase-admin");

//Inicialización
admin.initializeApp();
const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.onUserCreate = functions.firestore.document('sacramentos/{sacramentoId}').onCreate(async (snap, context) => {
  const values = snap.data();
  //Contar sacramentos realizados deacuerdo al id del sacerdote
  const query = db.collection("sacramentos"); //Anclaje
  const snapshot = await query.where("id_sacerdote", "==", values.id_sacerdote).get();
  const total = snapshot.size;
  try {
    db.collection("sacerdotes").doc(values.id_sacerdote).update({
      sacramentos_celebrados: total
    });
  } catch (error) {
    console.log(error);
  }
  await db.collection("log").add({
    descripcion: `El sacerdote con la id '${values.id_sacerdote}' ha celebrado ${total} sacramentos`
  });
});


