import React from "react";
import {Button, ButtonGroup, Checkbox} from "@shopify/polaris";

function Todo({todo, index, completeTodo, removeTodo}) {
    return (<div
        className="todo"
        >
        <Checkbox
            tone='magic'
            checked={todo.completed}
            label={todo.title}
            onChange={() => completeTodo(index)}

        />
        <ButtonGroup>
            {!todo.completed && <Button
                variant="primary"
                tone='success'
                size="large"
                onClick={() => completeTodo(index)}>
                Complete
            </Button>}
            <Button
                variant="primary"
                tone='critical'
                size="large"
                onClick={() => removeTodo(index)}>
                Delete
            </Button>
        </ButtonGroup>
    </div>);
}

export default Todo;
