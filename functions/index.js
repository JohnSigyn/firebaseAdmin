const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

// getuserbyemail
exports.userByEmail = functions.https.onRequest(async (req, res) => {
  if (getAuth(req.headers.auth)) {
    admin
      .auth()
      .getUserByEmail(req.body["email"])
      .then((user) => res.send(user))
      .catch((err) => res.send(err));
  } else {
    res.send("Unauthorised entry");
  }
});
// getuserbyid
exports.userByUid = functions.https.onRequest(async (req, res) => {
  if (getAuth(req.headers.auth)) {
    admin
      .auth()
      .getUser(req.body.uid)
      .then((user) => res.send(user))
      .catch((err) => res.send(err));
  } else {
    res.send("Unauthorised entry");
  }
});
// getuserbyphone
exports.getUsersByAny = functions.https.onRequest(async (req, res) => {
  if (getAuth(req.headers.auth)) {
    admin
      .auth()
      .getUsers(req.body)
      .then((userList) => res.send(userList))
      .catch((err) => res.send(err));
  } else {
    res.send("Unauthorised entry");
  }
});
// getuserbyany
exports.userByPhoneNo = functions.https.onRequest(async (req, res) => {
  if (getAuth(req.headers.auth)) {
    admin
      .auth()
      .getUserByPhoneNumber(req.body.phoneNo)
      .then((user) => res.send(user))
      .catch((err) => res.send(err));
  } else {
    res.send("Unauthorised entry");
  }
});
// createUser
exports.createUser = functions.https.onRequest(async (req, res) => {
  if (getAuth(req.headers.auth)) {
    admin
      .auth()
      .createUser(req.body)
      .then((user) => res.send(user))
      .catch((err) => res.send(err));
  } else {
    res.send("Unauthorised entry");
  }
});
// deleteUser
exports.deleteUser = functions.https.onRequest(async (req, res) => {
  if (getAuth(req.headers.auth)) {
    admin
      .auth()
      .deleteUsers(req.body)
      .then((user) => res.send(user))
      .catch((err) => res.send(err));
  } else {
    res.send("Unauthorised entry");
  }
});
// CustomClaims
exports.customClaims = functions.https.onRequest(async (req, res) => {
  let userArr = req.body.users,
    auth = req.headers.auth,
    resArr = [],
    customs = req.body.customClaims;
  if (userArr && auth === "fiemarq") {
    await userArr.forEach(async (e) => {
      await admin
        .auth()
        .setCustomUserClaims(e.id, {
          admin: e.customClaims,
        })
        .then(async () => {
          resArr.push(e);
          if (userArr.length === resArr.length) res.send(resArr);
        })
        .catch((err) => res.send(err));
    });
  } else if (auth !== "fiemarq") res.send("Unauthorised Request");
  else if (userArr.length === 0) res.send("Check your user Request");
});
// setCustomClaims
exports.customClaims = functions.https.onRequest(async (req, res) => {
  let user = req.body.user,
    auth = req.headers.auth,
    customs = req.body.customClaim;
  if (user && auth === "fiemarq") {
    await admin
      .auth()
      .setCustomUserClaims(user, {
        admin: customs,
      })
      .then(() => {
        res.send(user);
      });
  }
});

function getAuth(auth) {
  if (auth === "fiemarq") return true;
  else return false;
}
