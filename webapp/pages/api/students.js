import { getSession } from "next-auth/react";
import { getStudentsPracticeInfo } from "/src/lib/database";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (session && req.method === "GET") {
    const result = await getStudentsPracticeInfo({
      subjectId: req?.query?.subjectId,
      groupNumber: req?.query?.groupNumber,
      practiceId: req?.query?.practiceId,
    });

    res.json(result);
  } else {
    res.status(401);
  }
  res.end();
};

export default handler;
