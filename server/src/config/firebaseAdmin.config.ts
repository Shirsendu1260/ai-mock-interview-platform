import admin from 'firebase-admin';

// Download service account JSON from Firebase Console -> Project Settings -> Service Accounts
// Parse the raw service account JSON string from our environment variables back into a readable JavaScript object
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}') as Record<string, string>;

// Feed this security certificate to the Firebase Admin SDK so our backend has official 'admin' permissions
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

// Export this authenticated instance so our controllers can use it to verify incoming user tokens
export { admin };