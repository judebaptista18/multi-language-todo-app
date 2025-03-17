import { gql } from "@apollo/client";

export const GET_TODOS = gql`
  query GetTodos($userId: String!, $locale: String!) {
    todos(where: { userId: $userId, localeType: $locale }) {
      id
      title
      description
      dueDate
    }
  }
`;

export const ADD_TODO = gql`
  mutation AddTodo(
    $title: String!
    $description: String!
    $dueDate: DateTime!
    $userId: String!
    $locale: String!
  ) {
    createTodo(
      data: {
        title: $title
        description: $description
        dueDate: $dueDate
        userId: $userId
        localeType: $locale
      }
    ) {
      id
    }
  }
`;

export const PUBLISH_TODO = gql`
 mutation PublishTodo($id: ID!) {
  publishTodo(where: { id: $id }) {
    id
  }
}
`;


export const UPDATE_TODO = gql`
  mutation UpdateTodo(
    $id: ID!
    $title: String!
    $description: String!
    $dueDate: DateTime!
  ) {
    updateTodo(
      where: { id: $id }
      data: { title: $title, description: $description, dueDate: $dueDate }
    ) {
      id
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(where: { id: $id }) {
      id
    }
  }
`;
