import React, {useState} from 'react';
import {TextField, Button, InlineStack} from '@shopify/polaris';

function TodoForm({addTodo}) {
    const [text, setText] = useState('');

    const handleSubmit = () => {
        if (text) {
            addTodo(text);
            setText('');
        }
    };

    return (
            <InlineStack blockAlign="end" gap="200" wrap={false}>
                <div style={{ flexGrow: 1 }}>
                    <TextField
                        value={text}
                        onChange={setText}
                        placeholder="Enter your todo"
                        autoComplete='off'
                    />
                </div>
                <Button
                    variant={'primary'}
                    size={'large'}
                    onClick={handleSubmit}

                >Add Todo</Button>
            </InlineStack>
    );
}

export default TodoForm;
