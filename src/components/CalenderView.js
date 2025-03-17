"use client";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { GET_TODOS } from "@/lib/queries";

const localizer = momentLocalizer(moment);

export default function CalendarView({ locale }) {
  const { data: session } = useSession();
  const { data, loading, error } = useQuery(GET_TODOS, {
    variables: { userId: session?.userId, locale },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const events = data.todos.map((todo) => ({
    id: todo.id,
    title: todo.title,
    start: new Date(todo.dueDate),
    end: new Date(todo.dueDate),
  }));

  return (
    <div style={{ height: "500px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        onSelectEvent={(event) => alert(event.title)}
      />
    </div>
  );
}