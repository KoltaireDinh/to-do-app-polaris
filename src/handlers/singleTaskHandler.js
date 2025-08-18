import {doc, updateDoc, deleteDoc, addDoc, collection} from "firebase/firestore";

function createSingleTaskHandlers(db) {
    const singleTaskComplete = async (id, currentStatus) => {
        const todoRef = doc(db, "todos", id);
        await updateDoc(todoRef, {
            completed: !currentStatus
        });
    };


    const singleTaskRemove = async (id) => {
        await deleteDoc(doc(db, "todos", id));
    };

    const singleTaskCreate = async (title) => {
        if (title) {
            await addDoc(collection(db, "todos"), {
                title, completed: false
            });
        }
    };

    return {
        singleTaskRemove, singleTaskComplete, singleTaskCreate,
    };
}

export default createSingleTaskHandlers;