import { getSession } from "next-auth/react";
import { getUserGroups } from "/src/lib/database";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    const result = await getUserGroups(
      session.user.id,
      session.user.type,
      session.user.groupsIds
    );
    res.json(result);
  } else {
    res.status(401);
  }
  res.end();
};

export default handler;
