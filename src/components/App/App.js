import React, {useState, useEffect} from "react";
import {AppProvider, Page, Card, BlockStack} from "@shopify/polaris";
import enTranslations from '@shopify/polaris/locales/en.json';
import "./App.css";
import {db} from "../../firebase-config";
import {collection, onSnapshot} from "firebase/firestore";
import createBulkHandlers from "../../handlers/bulkHandler";
import TodoForm from "../TodoForm/TodoForm";
import ResourceLisWithBulkActionsAndManyItemsExample
    from "../ResourceLisWithBulkActionsAndManyItemsExample/ResourceLisWithBulkActionsAndManyItemsExample";
import createSingleTaskHandlers from "../../handlers/singleTaskHandler";

function App() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const {bulkComplete, bulkIncomplete, bulkRemove} = createBulkHandlers(db);
    const {singleTaskComplete, singleTaskRemove, singleTaskCreate} = createSingleTaskHandlers(db);

    useEffect(() => {
        const todosCol = collection(db, 'todos');
        const unsubscribe = onSnapshot(todosCol, (snapshot) => {
            const todoList = snapshot.docs.map(doc => ({
                ...doc.data(), id: doc.id
            }));
            setTodos(todoList);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    const handleAddTodo = async (title) => {
        await singleTaskCreate(title);
        setIsFormVisible(false);
    };

    const handleCompleteTodo = async (id) => {
        const todoToUpdate = todos.find(todo => todo.id === id);
        if (todoToUpdate) {
            await singleTaskComplete(id, todoToUpdate.completed);
        }
    };

    const handleRemoveTodo = async (id) => {
        await singleTaskRemove(id);
    };

    const handleCreateAction = () => {
        setIsFormVisible(!isFormVisible);
    };
    const primaryAction = {
        content: 'Create', onAction: handleCreateAction
    };


    return (<AppProvider i18n={enTranslations}>
        <Page title="Todos" primaryAction={primaryAction}>
            <BlockStack vertical>
                {isFormVisible && (<Card><TodoForm addTodo={handleAddTodo}/></Card>)}
                {loading ? (<div>Loading...</div>) : (<ResourceLisWithBulkActionsAndManyItemsExample
                    todos={todos}
                    completeTodo={handleCompleteTodo}
                    removeTodo={handleRemoveTodo}
                    bulkComplete={bulkComplete}
                    bulkIncomplete={bulkIncomplete}
                    bulkRemove={bulkRemove}
                />)}
            </BlockStack>
        </Page>
    </AppProvider>);
}

export default App;