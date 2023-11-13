import { getSession } from "next-auth/react";
import { updateSchedule, logScheduleEvent } from "/src/lib/database";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (session && req.method === "POST") {
    const args = req?.query?.args;
    const scheduleId = args[0];
    const body = req?.body;

    if (args[1] === "log") {
      const result = await logScheduleEvent(scheduleId, body.message);
      res.json(result.value);
    } else {
      const result = await updateSchedule(scheduleId, body);
      res.json(result.value);
    }
  } else {
    res.status(401);
  }
  res.end();
};

export default handler;
