import React, {useState} from 'react';
import {TextField, Button, InlineStack, BlockStack, Text} from '@shopify/polaris';

function TodoForm({addTodo}) {
    const [text, setText] = useState('');

    const handleSubmit = () => {
        if (text) {
            addTodo(text);
            setText('');
        }
    };

    return (
            <BlockStack blockAlign="end" gap="200" wrap={false}>
                <Text as='h1'>
                    Title
                </Text>
                <div style={{ flexGrow: 1 }}>
                    <TextField
                        title={'Title'}
                        value={text}
                        onChange={setText}
                        autoComplete='off'
                    />
                </div>
                <InlineStack align={'end'} gap={'200'}>
                    <Button
                        size={'large'}
                        onClick={handleSubmit}

                    >Cancel</Button>
                    <Button
                        variant={'primary'}
                        size={'large'}
                        onClick={handleSubmit}

                    >Add</Button>
                </InlineStack>

            </BlockStack>
    );
}

export default TodoForm;
