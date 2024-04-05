// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  Timestamp,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMIAN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type Todo = {
  id: string;
  title: string;
  is_done: boolean;
  created_at?: string;
};

// 모든 todo 조회
export async function fetchTodos(uid: string) {
  const querySnapshot = await getDocs(collection(db, "todos", uid, "todo"));
  if (querySnapshot.empty) return [];
  const fetchedTodos: Todo[] = [];
  querySnapshot.forEach((doc) => {
    const aTodo = {
      id: doc.id,
      title: doc.data().title,
      is_done: doc.data().is_done,
      created_at: doc.data().created_at.toDate(),
    };
    fetchedTodos.push(aTodo);
  });
  return fetchedTodos;
}

// 단일 todo 조회
export async function fetchATodo(uid: string, id: string) {
  if (!uid) return null;
  const todoDocRef = doc(db, "todos", uid, "todo", id);
  const todoDocSnap = await getDoc(todoDocRef);

  if (todoDocSnap.exists()) {
    const fetchedTodo = {
      id: todoDocSnap.id,
      title: todoDocSnap.data().title,
      is_done: todoDocSnap.data().is_done,
      created_at: todoDocSnap.data().created_at.toDate(),
    };
    return fetchedTodo;
  } else {
    return null;
  }
}

// 단일 todo 추가
export async function addATodo(uid: string, title: string) {
  const newTodoRef = doc(collection(db, "todos", uid, "todo"));
  const createAtTimeStamp = Timestamp.fromDate(new Date());
  const newTodo = {
    id: newTodoRef.id,
    title: title,
    is_done: false,
    created_at: createAtTimeStamp,
  };
  // later...
  await setDoc(newTodoRef, newTodo);

  return {
    id: newTodoRef.id,
    title,
    is_done: false,
    created_at: createAtTimeStamp.toDate(),
  };
}

// 단일 todo 수정
export async function updateATodo(
  uid: string,
  id: string,
  todo: { title: string; is_done: boolean }
) {
  const fetchedTodo = await fetchATodo(uid, id);
  if (fetchedTodo === null) return null;

  const todosRef = doc(db, "todos", uid, "todo", id);

  await updateDoc(todosRef, todo);
  return {
    ...fetchedTodo,
    title: todo.title,
    is_done: todo.is_done,
  };
}

// 단일 todo 삭제
export async function deleteATodo(uid: string, id: string) {
  if (id === null) return null;
  await deleteDoc(doc(db, "todos", uid, "todo", id));
}

// 인증
export const auth = getAuth();

export default {
  fetchTodos,
  fetchATodo,
  addATodo,
  deleteATodo,
};
