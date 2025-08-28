// controller/TodoController.js
import todoRepository from "../repository/TodoRepository.js";

const todoController = {
    /**
     * Get all todos
     * @param {Object} ctx - Koa context
     * @returns {Promise<void>}
     */
    getAllTodos: async (ctx) => {
        try {
            console.log('Controller: getAllTodos called');
            const data = await todoRepository.getAll();
            console.log('Controller: Retrieved todos:', data.length, 'items');

            ctx.body = {
                data,
                success: true,
                message: 'Todos retrieved successfully'
            };
            ctx.status = 200;
        } catch (error) {
            console.error('Controller: Error in getAllTodos:', error);
            ctx.body = {
                data: [],
                success: false,
                message: 'Error fetching todos',
                error: error.message
            };
            ctx.status = 500;
        }
    },

    /**
     * Create a new todo
     * @param {Object} ctx - Koa context
     * @returns {Promise<void>}
     */
    createTodo: async (ctx) => {
        try {
            console.log('Controller: createTodo called with:', ctx.request.body);
            const { title } = ctx.request.body;

            if (!title || typeof title !== 'string' || title.trim().length === 0) {
                ctx.body = {
                    data: null,
                    success: false,
                    message: 'Title is required and must be a non-empty string'
                };
                ctx.status = 400;
                return;
            }

            const data = await todoRepository.create(title.trim());
            console.log('Controller: Created todo:', data);

            ctx.body = {
                data,
                success: true,
                message: 'Todo created successfully'
            };
            ctx.status = 201;
        } catch (error) {
            console.error('Controller: Error in createTodo:', error);
            ctx.body = {
                data: null,
                success: false,
                message: 'Error creating todo',
                error: error.message
            };
            ctx.status = 500;
        }
    },

    /**
     * Update a todo
     * @param {Object} ctx - Koa context
     * @returns {Promise<void>}
     */
    updateTodo: async (ctx) => {
        try {
            console.log('Controller: updateTodo called with:', ctx.params, ctx.request.body);
            const { id } = ctx.params;
            const updateData = ctx.request.body;

            if (!id) {
                ctx.body = {
                    data: null,
                    success: false,
                    message: 'Todo ID is required'
                };
                ctx.status = 400;
                return;
            }

            const data = await todoRepository.update(id, updateData);
            console.log('Controller: Updated todo:', data);

            ctx.body = {
                data,
                success: true,
                message: 'Todo updated successfully'
            };
            ctx.status = 200;
        } catch (error) {
            console.error('Controller: Error in updateTodo:', error);
            ctx.body = {
                data: null,
                success: false,
                message: 'Error updating todo',
                error: error.message
            };
            ctx.status = 500;
        }
    },

    /**
     * Delete a todo
     * @param {Object} ctx - Koa context
     * @returns {Promise<void>}
     */
    deleteTodo: async (ctx) => {
        try {
            console.log('Controller: deleteTodo called with:', ctx.params);
            const { id } = ctx.params;

            if (!id) {
                ctx.body = {
                    data: null,
                    success: false,
                    message: 'Todo ID is required'
                };
                ctx.status = 400;
                return;
            }

            await todoRepository.remove(id);
            console.log('Controller: Deleted todo:', id);

            ctx.body = {
                data: { id },
                success: true,
                message: 'Todo deleted successfully'
            };
            ctx.status = 200;
        } catch (error) {
            console.error('Controller: Error in deleteTodo:', error);
            ctx.body = {
                data: null,
                success: false,
                message: 'Error deleting todo',
                error: error.message
            };
            ctx.status = 500;
        }
    },

    /**
     * Bulk update todos
     * @param {Object} ctx - Koa context
     * @returns {Promise<void>}
     */
    bulkUpdateTodos: async (ctx) => {
        try {
            console.log('Controller: bulkUpdateTodos called with:', ctx.request.body);
            const { ids, data: updateData } = ctx.request.body;

            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                ctx.body = {
                    data: null,
                    success: false,
                    message: 'IDs array is required and must not be empty'
                };
                ctx.status = 400;
                return;
            }

            await todoRepository.updateBulk(ids, updateData);
            console.log('Controller: Bulk updated todos:', ids.length, 'items');

            ctx.body = {
                data: { updatedIds: ids, updateData },
                success: true,
                message: 'Todos updated successfully'
            };
            ctx.status = 200;
        } catch (error) {
            console.error('Controller: Error in bulkUpdateTodos:', error);
            ctx.body = {
                data: null,
                success: false,
                message: 'Error performing bulk update',
                error: error.message
            };
            ctx.status = 500;
        }
    },

    /**
     * Bulk delete todos
     * @param {Object} ctx - Koa context
     * @returns {Promise<void>}
     */
    bulkDeleteTodos: async (ctx) => {
        try {
            console.log('Controller: bulkDeleteTodos called with:', ctx.request.body);
            const { ids } = ctx.request.body;

            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                ctx.body = {
                    data: null,
                    success: false,
                    message: 'IDs array is required and must not be empty'
                };
                ctx.status = 400;
                return;
            }

            await todoRepository.removeBulk(ids);
            console.log('Controller: Bulk deleted todos:', ids.length, 'items');

            ctx.body = {
                data: { deletedIds: ids },
                success: true,
                message: 'Todos deleted successfully'
            };
            ctx.status = 200;
        } catch (error) {
            console.error('Controller: Error in bulkDeleteTodos:', error);
            ctx.body = {
                data: null,
                success: false,
                message: 'Error performing bulk delete',
                error: error.message
            };
            ctx.status = 500;
        }
    },

    /**
     * Get a single todo by ID
     * @param {Object} ctx - Koa context
     * @returns {Promise<void>}
     */
    getTodo: async (ctx) => {
        try {
            console.log('Controller: getTodo called with:', ctx.params);
            const { id } = ctx.params;

            if (!id) {
                ctx.body = {
                    data: null,
                    success: false,
                    message: 'Todo ID is required'
                };
                ctx.status = 400;
                return;
            }

            const data = await todoRepository.getOne(id);

            if (!data) {
                ctx.body = {
                    data: null,
                    success: false,
                    message: 'Todo not found'
                };
                ctx.status = 404;
                return;
            }

            ctx.body = {
                data,
                success: true,
                message: 'Todo retrieved successfully'
            };
            ctx.status = 200;
        } catch (error) {
            console.error('Controller: Error in getTodo:', error);
            ctx.body = {
                data: null,
                success: false,
                message: 'Error fetching todo',
                error: error.message
            };
            ctx.status = 500;
        }
    }
};

export default todoController;