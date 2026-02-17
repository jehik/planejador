import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";

export const saveUserToCloud = async (userId, userData) => {
    if (!userId || !userData) return;
    try {
        await setDoc(doc(db, "users", userId), userData, { merge: true });
        console.log(`Dados de ${userId} salvos na nuvem.`);
        return true;
    } catch (e) {
        console.error("Erro ao salvar na nuvem:", e);
        return false;
    }
};

export const loadUserFromCloud = async (userId) => {
    if (!userId) return null;
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    } catch (e) {
        console.error("Erro ao carregar da nuvem:", e);
        return null;
    }
};
