import { deleteATodo, fetchATodo } from "@/data/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function DELETE(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uid, id } = req.query;

  const fetchedTodo = await fetchATodo(
    uid?.toString() ?? "",
    id?.toString() ?? ""
  );
  if (!fetchedTodo) {
    res.status(204);
  } else {
    await deleteATodo(uid?.toString() ?? "", id?.toString() ?? "");
    const response = {
      message: "단일 todo 삭제 완료",
      data: fetchedTodo,
    };
    res.status(200).json(response);
  }
}
