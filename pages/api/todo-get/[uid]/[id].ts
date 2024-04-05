import { fetchATodo } from "@/data/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { uid, id } = req.query;
  const fechedTodo = await fetchATodo(
    uid?.toString() ?? "",
    id?.toString() ?? ""
  );

  if (fechedTodo === null) {
    res.status(204).json(null);
    return;
  }
  const response = {
    message: "단일 todo 조회 완료",
    data: fechedTodo,
  };
  res.status(200).json(response);
}
