import { initializeApp } from 'firebase/app';
import { getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, Firestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBXSkROt15saNDWVietbLJvyP4TGbQzjFg",
    authDomain: "crwn-clothing-db-eb051.firebaseapp.com",
    projectId: "crwn-clothing-db-eb051",
    storageBucket: "crwn-clothing-db-eb051.appspot.com",
    messagingSenderId: "581463600063",
    appId: "1:581463600063:web:0c085d9582b9fdb9364f0a"
};


const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: "select_account"
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth) => {
    const userDocRef = doc(db, 'users', userAuth.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await setDoc(userDocRef, { displayName, email, createdAt });
        } catch (error) {
            console.log('error creating the user', error.message);
        }
    }

    return userDocRef;
}