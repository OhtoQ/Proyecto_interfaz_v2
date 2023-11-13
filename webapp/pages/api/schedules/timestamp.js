import { getSession } from "next-auth/react";
import { getSchedules } from "/src/lib/database";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (session && req.method === "GET") {
    const schedules = await getSchedules({
      practiceId: req?.query?.practiceId,
      subjectId: req?.query?.subjectId,
      status: req?.query?.status,
    });

    res.json(schedules.map((schedule) => schedule.timestamp));
  } else {
    res.status(401);
  }
  res.end();
};

export default handler;
