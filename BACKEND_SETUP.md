# Backend Setup Guide (Firebase + Vercel)

## 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project (e.g., `planejador-app`).
3. Enable **Authentication**:
   - Go to *Build > Authentication*.
   - Enable "Email/Password" provider.
4. Create **Firestore Database**:
   - Go to *Build > Firestore Database*.
   - Start in **Production mode**.
   - Select a location close to your users (e.g., `southamerica-east1`).
5. Enable **Storage**:
   - Go to *Build > Storage*.
   - Start in **Production mode**.

## 2. Get API Keys
1. In Firebase Console, go to *Project Settings*.
2. Scroll to "Your apps" and click the code icon (`</>`) to add a web app.
3. Register the app (e.g., `Planejador Web`).
4. Copy the `firebaseConfig` object values.

## 3. Environment Variables
Create a `.env` file in the root of your project (same level as `package.json`) and fill in your keys:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 4. Deploy to Vercel
1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/).
3. "Add New Project" and select your repository.
4. In "Environment Variables", add all the keys from step 3.
5. Click **Deploy**.

## 5. Security Rules
Copy the contents of `firestore.rules` and `storage.rules` into the "Rules" tab of Firestore and Storage in the Firebase Console respectively to secure your data.
