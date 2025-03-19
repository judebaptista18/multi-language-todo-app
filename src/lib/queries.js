import { gql } from "@apollo/client";

export const GET_TODOS = gql`
  query GetTodos($userId: String!, $locale: Locale!) {
    todos(where: { userId: $userId}, locales: [$locale]) {
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
  ) {
    createTodo(
      data: {
        title: $title
        description: $description
        dueDate: $dueDate
        userId: $userId
      }
    ) {
        id,title,description,dueDate
    }
  }
`;

export const PUBLISH_TODO = gql`
 mutation PublishTodo($id: ID!) {
  publishTodo(where: { id: $id }) {
     id,title,description,dueDate
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
      id,title,description,dueDate
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(where: { id: $id }) {
      id,title,description,dueDate
    }
  }
`;
