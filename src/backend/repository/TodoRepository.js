import {db} from "../firebase-config.js";


/**
 *
 * @param data
 * @returns {*|null}
 */
function formatDateFields(data) {
    if (!data) return null;

    const formatted = {...data};

    if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        formatted.createdAt = data.createdAt.toDate().toISOString();
    }
    if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
        formatted.updatedAt = data.updatedAt.toDate().toISOString();
    }

    return formatted;
}

const todoRepository = {
    /**
     *
     * @returns {Promise<[]>}
     */
    getAll: async () => {
        try {
            console.log('Repository: Getting all todos from Firebase Admin');
            const snapshot = await db.collection('todos').get();
            console.log('Repository: Firebase snapshot size:', snapshot.size);

            const todos = [];
            snapshot.forEach(doc => {
                const data = formatDateFields(doc.data());
                todos.push({
                    id: doc.id, ...data
                });
            });

            console.log('Repository: Mapped todos:', todos.length, 'items');
            return todos;
        } catch (error) {
            console.error('Repository: Error in getAll:', error);
        }
    },

    /**
     *
     * @param title
     * @returns {Promise<{id: string, title: *, completed: boolean, createdAt: string, updatedAt: string}>}
     */
    create: async (title) => {
        try {
            console.log('Repository: Creating todo with title:', title);
            const todoData = {
                title, completed: false, createdAt: new Date(), updatedAt: new Date()
            };

            const docRef = await db.collection('todos').add(todoData);

            const newTodo = {
                id: docRef.id,
                title,
                completed: false,
                createdAt: todoData.createdAt.toISOString(),
                updatedAt: todoData.updatedAt.toISOString()
            };

            console.log('Repository: Created todo:', newTodo);
            return newTodo;
        } catch (error) {
            console.error('Repository: Error in create:', error);
        }
    },

    /**
     *
     * @param id
     * @param data
     * @returns {Promise<*&{id}>}
     */
    update: async (id, data) => {
        try {

            const updateData = {
                ...data, updatedAt: new Date()
            };

            await db.collection('todos').doc(id).update(updateData);

            return {id, ...data};
        } catch (error) {
            console.error('Repository: Error in update:', error);
        }
    },

    /**
     *
     * @param id
     * @returns {Promise<void>}
     */
    remove: async (id) => {
        try {
            await db.collection('todos').doc(id).delete();
        } catch (error) {
            console.error('Repository: Error in remove:', error);
        }
    },

    /**
     *
     * @param ids
     * @param data
     * @returns {Promise<void>}
     */
    updateBulk: async (ids, data) => {
        try {

            const batch = db.batch();
            const updateData = {
                ...data, updatedAt: new Date()
            };

            ids.map(id => {
                const docRef = db.collection('todos').doc(id);
                batch.update(docRef, updateData);
            });

            await batch.commit();
        } catch (error) {
            console.error('Repository: Error in updateBulk:', error);
        }
    },

    /**
     *
     * @param ids
     * @returns {Promise<void>}
     */
    removeBulk: async (ids) => {
        try {

            const batch = db.batch();

            ids.map(id => {
                const docRef = db.collection('todos').doc(id);
                batch.delete(docRef);
            });

            await batch.commit();
        } catch (error) {
            console.error('Repository: Error in removeBulk:', error);
        }
    },

    /**
     * @param id
     * @returns {Promise<{id: string}|null>}
     */
    getOne: async (id) => {
        try {
            const doc = await db.collection('todos').doc(id).get();

            if (!doc.exists) {
                return null;
            }

            const data = formatDateFields(doc.data());
            return {id: doc.id, ...data}
        } catch (error) {
            console.error('Repository: Error in getOne:', error);
        }
    }
};

export default todoRepository;