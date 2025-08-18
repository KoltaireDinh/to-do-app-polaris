import React, {useEffect, useState} from "react";
import {AppProvider, Page, LegacyStack, Card} from "@shopify/polaris";
import enTranslations from '@shopify/polaris/locales/en.json';
import "./App.css";
import useFetchApi from "../../hooks/useFetchApi";
import TodoForm from "../TodoForm/TodoForm";
import ResourceLisWithBulkActionsAndManyItemsExample from "../ResourceLisWithBulkActionsAndManyItemsExample/ResourceLisWithBulkActionsAndManyItemsExample";
import { db } from "../../firebase-config";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

function App() {

    const [todos, setTodos] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const todosCol = collection(db, 'todos');
        const unsubscribe = onSnapshot(todosCol, (snapshot) => {
            const todoList = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setTodos(todoList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addTodo = async (title) => {
        if (title) {
            await addDoc(collection(db, "todos"), {
                title,
                completed: false
            });
            setIsFormVisible(false);
        }
    };

    const completeTodo = async (id) => {
        const todoRef = doc(db, "todos", id);
        const todoToUpdate = todos.find(todo => todo.id === id);
        if (todoToUpdate) {
            await updateDoc(todoRef, {
                completed: !todoToUpdate.completed
            });
        }
    };

    // Remove a todo by id
    const removeTodo = async (id) => {
        await deleteDoc(collection(db, "todos", id));
    };

    const handleCreateAction = () => {
        setIsFormVisible(!isFormVisible);
    };
    const primaryAction = {
        content: 'Create', onAction: handleCreateAction
    };

    return (<AppProvider i18n={enTranslations}>
        <Page title="Todos" primaryAction={primaryAction}>
            <LegacyStack vertical>
                {isFormVisible && (<Card><TodoForm addTodo={addTodo}/></Card>)}

                {loading ? (<div>Loading...</div>) :
                    (<ResourceLisWithBulkActionsAndManyItemsExample
                        setTodos={setTodos}
                        todos={todos}
                        completeTodo={completeTodo}
                        removeTodo={removeTodo}/>
                    )}
            </LegacyStack>
        </Page>

    </AppProvider>);
}

export default App;
