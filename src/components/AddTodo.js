"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";
import { ADD_TODO, PUBLISH_TODO, GET_TODOS, UPDATE_TODO } from "@/lib/queries";

export default function AddTodo({
  isUpdate,
  displayMode,
  onClose,
  setTodo,
  todo,
  initialFormState,
}) {
  const { data: session } = useSession();

  const [addTodo, { loading }] = useMutation(ADD_TODO, {
    update(cache, { data }) {
      if (!data?.createTodo) return;
      const newTodo = data.createTodo;
      const newTodoRef = cache.identify(newTodo);
      cache.modify({
        fields: {
          todos(existingTodos = []) {
            return [...existingTodos, { __ref: newTodoRef }];
          },
        },
      });
    },
  });

  const [updateTodo] = useMutation(UPDATE_TODO, {
    update(cache, { data }) {
      if (!data?.updateTodo) return;
      const updatedTodo = data.updateTodo;
      const updatedTodoRef = cache.identify(updatedTodo);
      cache.modify({
        fields: {
          todos(existingTodos = []) {
            return existingTodos.map((todo) =>
              todo.__ref === updatedTodoRef ? { __ref: updatedTodoRef } : todo
            );
          },
        },
      });
    },
  });
  const [publishTodo] = useMutation(PUBLISH_TODO);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let todoId;
    try {
      if (!isUpdate) {
        const { data } = await addTodo({
          variables: {
            title: todo.title,
            description: todo.description,
            dueDate: new Date(todo.dueDate).toISOString(),
            userId: session?.userId,
          },
        });
        todoId = data?.createTodo?.id;
      } else {
        const { data } = await updateTodo({
          variables: {
            id: todo.id,
            title: todo.title,
            description: todo.description,
            dueDate: new Date(todo.dueDate).toISOString(),
          },
        });
        todoId = data?.updateTodo?.id;
      }

      if (todoId) {
        await publishTodo({ variables: { id: todoId } });
      }
      setTodo(initialFormState);
      onClose?.();
    } catch (error) {
      console.error("Error submitting todo:", error);
    }
  };

  const setFormValues = useCallback(
    (event) => {
      const { name, value } = event.target;
      setTodo((prev) => ({ ...prev, [name]: value }));
    },
    [setTodo]
  );

  console.log("data", todo);
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={todo.title}
          onChange={setFormValues}
          placeholder="Title"
          required
          disabled={displayMode}
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={todo.description}
          onChange={setFormValues}
          placeholder="Description"
          required
          disabled={displayMode}
          style={{height: "100px"}}
        />

        <input
          type="date"
          name="dueDate"
          value={todo.dueDate}
          onChange={setFormValues}
          required
          disabled={true}
        />
        {!displayMode && (
          <button type="submit" disabled={loading}>
            {isUpdate ? "Update Todo" : "Add Todo"}
          </button>
        )}
      </form>
    </div>
  );
}
