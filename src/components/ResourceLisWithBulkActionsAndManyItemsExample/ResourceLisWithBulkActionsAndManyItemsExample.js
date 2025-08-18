import React, {useState} from 'react';
import {
    Card, ResourceItem, ResourceList, Text, BlockStack, InlineStack, Button, ButtonGroup, Badge,
} from '@shopify/polaris';

function ResourceListWithBulkActionsAndManyItemsExample({todos, completeTodo, removeTodo, setTodos}) {
    const [selectedItems, setSelectedItems] = useState([]);

    const handleBulkDelete = () => {
        const updatedTodos = todos.filter(todo => !selectedItems.includes(todo.id.toString()));
        setTodos(updatedTodos);
        setSelectedItems([]);
    };

    const handleBulkCompleteFilter = () => {
        const updatedTodos = todos.map(todo => {
            if (selectedItems.includes(todo.id.toString())) {
                return {
                    ...todo, completed: true
                };
            }
            return todo;
        });
        setTodos(updatedTodos);
        setSelectedItems([]);
    };

    const handleBulkInCompleteFilter = () => {
        const updatedTodos = todos.map(todo => {
            if (selectedItems.includes(todo.id.toString())) {
                return {
                    ...todo, completed: false
                };
            }
            return todo;
        });
        setTodos(updatedTodos);
        setSelectedItems([]);
    };

    const resourceName = {
        singular: 'todo', plural: 'todos',
    };

    return (<BlockStack gap="400">
        <Card padding="0">
            <ResourceList
                resourceName={resourceName}
                items={todos}
                renderItem={renderItem}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                selectable
            />
        </Card>
        {selectedItems.length > 0 && (<InlineStack align={"center"}>
            <ButtonGroup>
                <Button onClick={handleBulkCompleteFilter}>Complete</Button>
                <Button onClick={handleBulkInCompleteFilter}>Incomplete</Button>
                <Button onClick={handleBulkDelete}>Delete</Button>
            </ButtonGroup>
        </InlineStack>)}
    </BlockStack>);

    function renderItem(todo) {
        const {id, title, completed} = todo;

        return (<ResourceItem
            id={id}
            url='#'
            accessibilityLabel={`View details for ${title}`}
            persistActions
        >
            <InlineStack align="space-between" blockAlign="center" wrap={false}>
                <Text fontWeight="regular" as="span">
                    {title}
                </Text>
                <InlineStack blockAlign={'center'} gap="300">
                    {completed ? (<Badge
                        tone='success'
                        size='large'
                        status={'success'}> Complete
                    </Badge>) : (<Badge
                            tone='warning-strong'
                            size='large'
                            status={'success'}> Incomplete
                        </Badge>

                    )}
                    <ButtonGroup>
                        {!completed && (<Button
                            variant="primary"
                            tone="success"
                            size="large"
                            onClick={() => completeTodo(id)}
                        >
                            Complete
                        </Button>)}
                        <Button
                            variant="primary"
                            tone="critical"
                            size="large"
                            onClick={() => removeTodo(id)}
                        >
                            Delete
                        </Button>
                    </ButtonGroup>
                </InlineStack>
            </InlineStack>
        </ResourceItem>);
    }
}

export default ResourceListWithBulkActionsAndManyItemsExample;