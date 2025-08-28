import React, {useState} from 'react';
import {
    Badge,
    BlockStack,
    Button,
    ButtonGroup,
    Card,
    InlineStack,
    ResourceItem,
    ResourceList,
    Text,
} from '@shopify/polaris';

function ResourceListTodo({
                              todos,
                              completeTodo,
                              removeTodo,
                              bulkComplete,
                              bulkIncomplete,
                              bulkRemove
                          }) {

    const [selectedItems, setSelectedItems] = useState([]);
    const [bulkLoading, setBulkLoading] = useState(false);
    const [bulkAction, setBulkAction] = useState(null);
    const resourceName = {
        singular: 'todo', plural: 'todos',
    };


    const handleBulkComplete = async () => {
        setBulkLoading(true);
        setBulkAction('complete');
        try {
            await bulkComplete(selectedItems);
            setSelectedItems([]);
        } finally {
            setBulkLoading(false);
        }
    };

    const handleBulkIncomplete = async () => {
        setBulkLoading(true);
        setBulkAction('incomplete');
        try {
            await bulkIncomplete(selectedItems);
            setSelectedItems([]);
        } finally {
            setBulkLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        setBulkLoading(true);
        setBulkAction('delete');
        try {
            await bulkRemove(selectedItems);
            setSelectedItems([]);
        } finally {
            setBulkLoading(false);
        }
    };

    return (
        <BlockStack gap="400">
            <Card padding="0">
                <ResourceList
                    resourceName={resourceName}
                    items={todos}
                    renderItem={renderItem}
                    selectedItems={selectedItems}
                    onSelectionChange={setSelectedItems}
                    selectable
                    //bulkActions={bulkAction}
                />
            </Card>
            {selectedItems.length > 0 && (
                <InlineStack align={"center"}>
                    <ButtonGroup>
                        <Button
                            size="large"
                            loading={bulkLoading && bulkAction === 'complete'}
                            disabled={bulkLoading}
                            onClick={handleBulkComplete}
                        >
                            Complete
                        </Button>
                        <Button
                            size="large"
                            loading={bulkLoading && bulkAction === 'incomplete'}
                            disabled={bulkLoading}
                            onClick={handleBulkIncomplete}
                        >
                            Incomplete
                        </Button>
                        <Button
                            size="large"
                            loading={bulkLoading && bulkAction === 'delete'}
                            disabled={bulkLoading}
                            onClick={handleBulkDelete}
                        >
                            Delete
                        </Button>
                    </ButtonGroup>
                </InlineStack>
            )}
        </BlockStack>
    );

    function renderItem(todo) {
        const {id, title, completed} = todo;

        return (
            <ResourceItem
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
                        {completed ? (
                            <Badge
                                tone='success'
                                size='large'
                                status={'success'}
                            >
                                Complete
                            </Badge>
                        ) : (
                            <Badge
                                tone='warning-strong'
                                size='large'
                                status={'success'}
                            >
                                Incomplete
                            </Badge>
                        )}
                        <ButtonGroup>
                            {!completed && (
                                <Button
                                    variant="primary"
                                    tone="success"
                                    size="large"
                                    onClick={() => completeTodo(id)}
                                >
                                    Complete
                                </Button>
                            )}
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
            </ResourceItem>
        );
    }
}

export default ResourceListTodo;