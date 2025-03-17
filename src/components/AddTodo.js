"use client";

import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useSession } from "next-auth/react";
import { ADD_TODO } from "@/lib/queries";

export default function AddTodo({ locale }) {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [addTodo] = useMutation(ADD_TODO);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTodo({
      variables: { title, description, dueDate, userId: session?.userId, locale:locale },
    });
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
      <button type="submit">Add Todo</button>
    </form>
  );
}