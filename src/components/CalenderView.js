"use client";
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { GET_TODOS } from "@/lib/queries";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function CalendarView({
  locale,
  addEventHandler,
  deleteEventHandler,
  displayEventHandler,
  handleUpdateEvent,
}) {
  const { data: session } = useSession();
  const { data, loading, error , refetch} = useQuery(GET_TODOS, {
    variables: { userId: session?.userId, locale },
  });

  useEffect(() => {
    if (locale) {
      refetch({ locale });
    }
  }, [locale, refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const events = data.todos.map((todo) => ({
    id: todo.id,
    title: todo.title,
    description: todo.description,
    start: new Date(todo.dueDate),
    end: new Date(todo.dueDate),
  }));

  function renderEventContent(eventInfo) {
    return (
      <div className="event-container">
        <p>{eventInfo.event.title}</p>
        <div>
          <FontAwesomeIcon
            icon={faPenSquare}
            className="fa-icon"
            onClick={(e) => handleUpdateEvent(eventInfo.event, e)}
          />
          <FontAwesomeIcon
            icon={faTrash}
            className="fa-icon"
            onClick={(e) => deleteEventHandler(eventInfo.event, e)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        nowIndicator={true}
        selectable={false}
        editable={false}
        droppable={false}
        events={events}
        eventClick={(args) => displayEventHandler(args)}
        dateClick={(args) => addEventHandler(args)}
        eventContent={renderEventContent}
        locale={locale}
        height={600}
      />
    </div>
  );
}
