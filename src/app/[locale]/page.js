"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";

import { DELETE_TODO } from "@/lib/queries";
import AddTodo from "@/components/AddTodo";
import CalendarView from "@/components/CalenderView";
import Modal from "@/components/Modal";
import LocaleSwitchSelect from "@/components/LocaleSwitchSelect";

export default function Home() {
  const locale = useLocale();
  const t = useTranslations("HomePage");
  const { data: session } = useSession();
  const [todo, setTodo] = useState({});
  const [modalState, setModalState] = useState({ isOpen: false, type: null });
  const initialFormState = {
    id: "",
    title: "",
    description: "",
    dueDate: "",
  };

  const MODAL_TITLES = {
    ADD: t("add"),
    UPDATE: t("update"),
    VIEW: t("view"),
    DELETE: t("delete"),
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
          <p>{t("addInstruction")}</p>
        </div>
        <div className="right">
          <LocaleSwitchSelect defaultValue={locale}/>
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
          <p>{t("confirm")}</p>
          <div>
            <button onClick={handleConfirmDelete}>{t("yes")}</button>
            <button
              onClick={() => {
                closeModal;
                setTodo(initialFormState);
              }}
            >
              {t("no")}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
