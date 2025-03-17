"use client";

import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useSession } from "next-auth/react";
import { ADD_TODO, PUBLISH_TODO } from "@/lib/queries";

export default function AddTodo({ locale }) {
  const { data: session } = useSession();
  const [todo, setTodo] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [addTodo] = useMutation(ADD_TODO);
  const [publishTodo] = useMutation(PUBLISH_TODO);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let { data } = await addTodo({
      variables: {
        title: todo.title,
        description: todo.description,
        dueDate: new Date(todo.dueDate).toISOString(),
        userId: session?.userId,
        locale: locale,
      },
    });
    await publishTodo({
      variables: { id: data.createTodo.id },
    });
  };

  const setFormValues = (event) => {
    console.log(event.target.value);
    const value = event.target.value;
    // event.target.type == "datetime-local" ? formatDate(event.target.value) : event.target.value;
    setTodo((prev) => ({ ...prev, [event.target.name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={todo.title}
        onChange={(e) => setFormValues(e)}
        placeholder="Title"
        required
      />
      <input
        type="text"
        value={todo.description}
        name="description"
        onChange={(e) => setFormValues(e)}
        placeholder="Description"
        required
      />
      <input
        type="datetime-local"
        name="dueDate"
        // value={todo.dueDate.split("/").reverse().join("/")}
        value={todo.dueDate}
        onChange={(e) => setFormValues(e)}
        required
      />
      <button type="submit">Add Todo</button>
    </form>
  );
}
