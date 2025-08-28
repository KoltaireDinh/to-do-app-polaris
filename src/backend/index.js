import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import todoController from "./controller/TodoController.js";
import cors from '@koa/cors';

const app = new Koa();
const router = new Router();
app.use(bodyParser());
app.use(cors());
router.get('/api/todos', todoController.getAllTodos);
router.post('/api/todos', todoController.createTodo);
router.put('/api/todos/:id', todoController.updateTodo);
router.delete('/api/todos/:id', todoController.deleteTodo);
router.post('/api/todos/bulk-update', todoController.bulkUpdateTodos);
router.post('/api/todos/bulk-delete', todoController.bulkDeleteTodos);

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
    console.log('Koa server listening on port 3000');
});