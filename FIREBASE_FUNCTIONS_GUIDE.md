# Firebase Cloud Messaging V1 - Backend Logic

Since you are not using the "Legacy" API, and purely client-side sending is impossible with the new secure V1 API, you must deploy a serverless Firebase function.

This function does **not** require managing a server. It runs on Google's infrastructure within your Firebase project.

## 1. Requirement
You must be on the **Formula (Blaze) Plan** (Pay as you go) to use Cloud Functions. The Free Tier (Spark) does not support outbound requests to external APIs (like FCM).

## 2. Setup
If you haven't initialized functions yet:
```bash
npm install -g firebase-tools
firebase login
firebase init functions
# Select TypeScript or JavaScript (code below is JavaScript for simplicity)
```

## 3. The Function Code
Replace contents of `functions/index.js` with this:

```javascript
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Triggered when a document is created in 'notifications' collection.
 * Sends FCM Push Notification using the V1 API.
 */
exports.sendPushNotification = functions.firestore
  .document("notifications/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const tokens = data.tokens; // Array of FCM tokens
    const notification = data.notification; // { title, body }

    if (!tokens || tokens.length === 0) {
      console.log("No tokens found for notification");
      return;
    }

    // FCM V1 Message structure
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      // You can add data payload if needed
      data: {
        click_action: "FLUTTER_NOTIFICATION_CLICK" 
      }
    };

    // Send to each token
    // Note: V1 API does not support multicast (batch send) natively like Legacy did.
    // We iterate or use Promise.all.
    const promises = tokens.map(token => {
      return admin.messaging().send({
        token: token,
        ...message
      });
    });

    try {
      const results = await Promise.allSettled(promises);
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      console.log(`Successfully sent ${successCount} notifications.`);
      
      // Optional: Update the document status to 'sent'
      return snap.ref.update({ status: 'sent', sentAt: admin.firestore.FieldValue.serverTimestamp() });
    } catch (error) {
      console.error("Error sending notifications", error);
      return snap.ref.update({ status: 'error', error: error.message });
    }
  });
```

## 4. Deploy
```bash
firebase deploy --only functions
```

## 5. How it Works
1. Frontend (your React app) writes a document to `notifications` collection in Firestore.
2. This Cloud Function wakes up automatically.
3. It reads the tokens and message.
4. It calls the secure Firebase Admin SDK to send the message via the V1 API.
