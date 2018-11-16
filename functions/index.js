const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    console.log('Sending Hello from Firebase!');
    response.status(200).send('Hello from Firebase!');
  });
});

//
// const functions = require('firebase-functions');
//
// const moment = require('moment');
// const cors = require('cors')({ origin: true });
//
// exports.date = functions.https.onRequest((req, res) => {
//     if (req.method === 'PUT') {
//         res.status(403).send('Forbidden!');
//     }
//
//     cors(req, res, () => {
//         let format = req.query.format;
//         if (!format) {
//             format = req.body.format;
//         }
//         const formattedDate = moment().format(format);
//         console.log('Sending Formatted date:', formattedDate);
//         res.status(200).send(formattedDate);
//     });
// });
