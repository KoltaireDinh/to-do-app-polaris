import { doc, updateDoc, deleteDoc } from "firebase/firestore";

function createBulkHandlers(db) {
    const bulkComplete = async (ids) => {
        const promises = ids.map(id => updateDoc(doc(db, "todos", id), { completed: true }));
        await Promise.all(promises);
    };

    const bulkIncomplete = async (ids) => {
        const promises = ids.map(id => updateDoc(doc(db, "todos", id), { completed: false }));
        await Promise.all(promises);
    };

    const bulkRemove = async (ids) => {
        const promises = ids.map(id => deleteDoc(doc(db, "todos", id)));
        await Promise.all(promises);
    };

    return {
        bulkComplete,
        bulkIncomplete,
        bulkRemove
    };
}

export default createBulkHandlers;