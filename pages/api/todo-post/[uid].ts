import { addATodo } from "@/data/firestore";
import { NextApiRequest, NextApiResponse } from "next";

// 새로운 todo 생성
export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { uid } = req.query;
  const title = JSON.parse(req.body).title;

  if (title === null || title === "") {
    const response = { message: "작성된 내용이 없습니다." };
    res.status(422).json(response);
    return;
  }

  const addedTodo = await addATodo(uid?.toString() ?? "", title);

  const data = {
    message: "todo 추가 완료",
    data: addedTodo,
  };
  res.status(200).json(data);
}
