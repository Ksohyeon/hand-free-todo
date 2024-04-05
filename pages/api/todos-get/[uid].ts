import type { NextApiRequest, NextApiResponse } from "next";
import { fetchTodos } from "@/data/firestore";

type Todo = { id: string; title: string; is_done: boolean };
type Data = { message: string; data: Todo[] };

// 모든 todo 조회
export default async function GET(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { uid } = req.query;
  const todos = await fetchTodos(uid?.toString() ?? "");
  const data = { message: "모든 todo 조회", data: todos };
  res.status(200).json(data);
}
