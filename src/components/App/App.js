import React, {useState} from "react";
import {AppProvider, BlockStack, Modal, Page} from "@shopify/polaris";
import enTranslations from '@shopify/polaris/locales/en.json';
import useFetchApi from "../../hooks/useFetchApi";
import TodoForm from "../TodoForm/TodoForm";
import ResourceListTodo from "../ResourceList/ResourceList";

// Define the API base URL
const API_BASE_URL = 'http://localhost:3000';

function App() {
    const {
        data: apiResponse, loading, error, setData: setApiResponse
    } = useFetchApi(`${API_BASE_URL}/api/todos`);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const todos = apiResponse?.data || [];
    const handleAddTodo = async (title) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/todos`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    title
                }),
            });
            const result = await response.json();
            console.log('Add todo result:', result);
            const newTodo = result.data;

            setApiResponse(prev => ({
                ...prev, data: [...todos, newTodo]
            }));
            setIsFormVisible(false);
        } catch (err) {
            console.error('Error adding todo:', err);
        }
    };

    const handleCompleteTodo = async (id) => {
        try {
            const todoToUpdate = todos.find(todo => todo.id === id);
            if (todoToUpdate) {
                const newStatus = !todoToUpdate.completed;
                const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
                    method: 'PUT', headers: {
                        'Content-Type': 'application/json'
                    }, body: JSON.stringify({
                        completed: newStatus
                    }),
                });
                const result = await response.json();
                console.log('Complete todo result:', result);

                setApiResponse(prev => ({
                    ...prev, data: todos.map(todo => todo.id === id ? {...todo, completed: newStatus} : todo)
                }));
            }
        } catch (err) {
            console.error('Error completing todo:', err);
        }
    };

    const handleRemoveTodo = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            console.log('Remove todo result:', result);

            setApiResponse(prev => ({
                ...prev, data: todos.filter(todo => todo.id !== id)
            }));
        } catch (err) {
            console.error('Error removing todo:', err);
        }
    };

    const bulkComplete = async (ids) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/todos/bulk-update`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    ids, data: {
                        completed: true
                    }
                }),
            });
            const result = await response.json();
            console.log('Bulk complete result:', result);

            setApiResponse(prev => ({
                ...prev, data: todos.map(todo => ids.includes(todo.id) ? {...todo, completed: true} : todo)
            }));
        } catch (err) {
            console.error('Error bulk completing todos:', err);
        }
    };

    const bulkIncomplete = async (ids) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/todos/bulk-update`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    ids, data: {
                        completed: false
                    }
                }),
            });
            const result = await response.json();
            console.log('Bulk incomplete result:', result);

            setApiResponse(prev => ({
                ...prev, data: todos.map(todo => ids.includes(todo.id) ? {...todo, completed: false} : todo)
            }));
        } catch (err) {
            console.error('Error bulk incomplete todos:', err);
        }
    };

    const bulkRemove = async (ids) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/todos/bulk-delete`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    ids
                }),
            });
            const result = await response.json();
            console.log('Bulk remove result:', result);

            setApiResponse(prev => ({
                ...prev, data: todos.filter(todo => !ids.includes(todo.id))
            }));
        } catch (err) {
            console.error('Error bulk removing todos:', err);
        }
    };

    const handleCreateAction = () => {
        setIsFormVisible(!isFormVisible);
    };

    const handleCloseModal = () => {
        setIsFormVisible(false);
    };

    const primaryAction = {
        content: 'Create', onAction: handleCreateAction
    };

    if (error) {
        return (<AppProvider i18n={enTranslations}>
            <Page title="Todoes">
                <div style={{padding: '20px', color: 'red'}}>
                    <h3>Error loading todos:</h3>
                    <p>{error.message}</p>
                    <pre>{JSON.stringify(error, null, 2)}</pre>
                </div>
            </Page>
        </AppProvider>);
    }

    return (<AppProvider i18n={enTranslations}>
        <Page title="Todoes" primaryAction={primaryAction}>
            <BlockStack>
                <Modal
                    size="small"
                    open={isFormVisible}
                    title={"Create Task"}
                    onClose={handleCloseModal}
                >
                    <Modal.Section>
                        <TodoForm addTodo={handleAddTodo}/>
                    </Modal.Section>
                </Modal>
                {loading ? (<div>Loading...</div>) : (<ResourceListTodo
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