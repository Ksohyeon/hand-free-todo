import { updateATodo } from "@/data/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function UPDATE(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uid, id } = req.query;
  const body = JSON.parse(req.body);
  const { title, is_done } = body;
  console.log("title: ", title);
  console.log("is_done: ", is_done);

  if (typeof uid !== "string" && typeof id !== "string") {
    res.status(204).json({ message: "요청이 잘못 되었습니다." });
    return;
  }
  const updatedTodo = await updateATodo(
    uid?.toString() ?? "",
    id?.toString() ?? "",
    {
      title,
      is_done,
    }
  );
  if (updatedTodo === null) {
    res
      .status(204)
      .json({ message: "존재하지 않는 일정의 수정을 요청했습니다." });
    return;
  }
  const response = {
    message: "단일 todo 수정 완료",
    data: updatedTodo,
  };
  res.status(200).json(response);
}
