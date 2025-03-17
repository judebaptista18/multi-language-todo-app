"use client";

import { useSession } from "next-auth/react";
import TodoList from "@/components/TodoList";
import AddTodo from "@/components/AddTodo";
import CalendarView from "@/components/CalenderView";

export default function Home() {
  const { data: session } = useSession();
  const locale = "en";

  if (!session) {
    return <p>Please sign in to view your todos.</p>;
  }

  return (
    <div>
      <h1>Todos</h1>
      <AddTodo locale={locale} />
      <h2>Calendar View</h2>
      <CalendarView locale={locale} />
    </div>
  );
}