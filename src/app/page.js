"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";
import { DELETE_TODO } from "@/lib/queries";

import AddTodo from "@/components/AddTodo";
import CalendarView from "@/components/CalenderView";
import Modal from "@/components/Modal";

const MODAL_TITLES = {
  ADD: "Add Todo",
  UPDATE: "Update Todo",
  VIEW: "View Todo",
  DELETE: "Delete Todo",
};

export default function Home() {
  const { data: session } = useSession();
  const [locale, setLocale] = useState("en");
  const [todo, setTodo] = useState();
  const [modalState, setModalState] = useState({ isOpen: false, type: null });
  const initialFormState = {
    id: "",
    title: "",
    description: "",
    dueDate: ""
  };
  const [deleteTodo] = useMutation(DELETE_TODO, {
    update(cache, { data }) {
      if (!data?.deleteTodo) return;
      const deletedTodoId = data.deleteTodo.id;

      cache.modify({
        fields: {
          todos(existingTodos = []) {
            return existingTodos.filter(
              (todo) => todo.__ref !== `Todo:${deletedTodoId}`
            );
          },
        },
      });
    },
  });

  if (!session) return <p>Please sign in to view your todos.</p>;

  const openModal = (type, todoData = {}) => {
    setTodo((prev) => ({ ...prev, ...todoData }));
    setModalState({ isOpen: true, type });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null });
    setTodo(initialFormState);
  };

  const handleLocaleChange = (e) => {
    setLocale(e.target.value);
  };

  const handleAddEvent = (args) => {
    const obj = { dueDate: args.dateStr };
    openModal("ADD", obj);
  };

  const handleViewEvent = (data) => {
    data.jsEvent.stopPropagation();
    const obj = {
      id: data.id,
      title: data.event.title,
      description: data.event.extendedProps.description,
      dueDate: data.event.start.toISOString().split("T")[0],
    };
    openModal("VIEW", obj);
  };

  const handleUpdateEvent = (event, e) => {
    e.stopPropagation();
    const obj = {
      id: event.id,
      title: event.title,
      description: event.extendedProps.description,
      dueDate: event.start.toISOString().split("T")[0],
    };
    openModal("UPDATE", obj);
  };

  const handleDeleteEvent = (event, e) => {
    e.stopPropagation();
    openModal("DELETE", { id: event.id });
  };

  const handleConfirmDelete = async () => {
    await deleteTodo({ variables: { id: todo.id } });
    closeModal();
    setTodo(initialFormState);
  };

  return (
    <>
      <div className="container-flex">
        <div className="left">
          <p>Click on the calender to add todo.</p>
        </div>
        <div className="right">
          <select onChange={handleLocaleChange} value={locale}>
            <option value="en">English</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>

      <CalendarView
        locale={locale}
        addEventHandler={handleAddEvent}
        deleteEventHandler={handleDeleteEvent}
        displayEventHandler={handleViewEvent}
        handleUpdateEvent={handleUpdateEvent}
      />

      {["ADD", "UPDATE", "VIEW"].includes(modalState.type) && (
        <Modal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          title={MODAL_TITLES[modalState.type]}
        >
          <AddTodo
            onClose={closeModal}
            setTodo={setTodo}
            todo={todo}
            isUpdate={modalState.type === "UPDATE"}
            displayMode={modalState.type === "VIEW"}
            initialFormState={initialFormState}
          />
        </Modal>
      )}

      {modalState.type === "DELETE" && (
        <Modal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          title={MODAL_TITLES.DELETE}
        >
          <p>Confirm Delete?</p>
          <div>
            <button onClick={handleConfirmDelete}>Yes</button>
            <button
              onClick={() => {
                closeModal;
                setTodo(initialFormState);
              }}
            >
              No
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
