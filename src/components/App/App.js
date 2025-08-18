import React, {useEffect, useState} from "react";
import {AppProvider, Page, LegacyStack, Card} from "@shopify/polaris";
import enTranslations from '@shopify/polaris/locales/en.json';
import "./App.css";
import useFetchApi from "../../hooks/useFetchApi";
import TodoForm from "../TodoForm/TodoForm";
import ResourceLisWithBulkActionsAndManyItemsExample from "../ResourceLisWithBulkActionsAndManyItemsExample/ResourceLisWithBulkActionsAndManyItemsExample";

function App() {
    const {
        data: fetchedTodos,
        loading
    } = useFetchApi("https://jsonplaceholder.typicode.com/todos?_limit=10");

    const [todos, setTodos] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        if (fetchedTodos) {
            const formattedTodos = fetchedTodos.map(todo => ({
                ...todo,
                id: todo.id.toString()
            }));
            setTodos(formattedTodos);
        }
    }, [fetchedTodos]);
    const addTodo = (text) => {
        if (text) {
            setTodos((previousTodos) => [...previousTodos, {id: Date.now().toString(),title: text, completed: false}]);
            setIsFormVisible(false);
        }
    };

    const completeTodo = (id) => {
        const updatedTodos = todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(updatedTodos);
    };

    // Remove a todo by id
    const removeTodo = (id) => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
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
