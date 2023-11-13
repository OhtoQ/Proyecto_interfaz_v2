import { MongoClient, ObjectId } from "mongodb";
import { getScheduleImprovedStatus } from "/src/utils/scheduleUtils";

async function connectToCluster() {
  const uri = process.env.DB_URI;
  let mongoClient;

  try {
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();

    return mongoClient;
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed!", error);
    process.exit();
  }
}

export async function getUser(id) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster();
    const db = mongoClient.db("laboratorioremotofi");
    const collection = db.collection("users");
    return await collection.findOne({ id });
  } finally {
    await mongoClient.close();
  }
}

export async function getUserGroups(userId, userType, groupsIds) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster();
    const db = mongoClient.db("laboratorioremotofi");
    const subjectsCollection = db.collection("subjects");
    const schedulesCollection = db.collection("schedules");
    const practicesCollection = db.collection("practices");

    const groups = [];

    for (const index in groupsIds) {
      const groupId = groupsIds[index];
      const semester = groupId.split("_")[0];
      const subjectId = groupId.split("_")[1];
      const groupNumber = groupId.split("_")[2];

      const subject = await subjectsCollection.findOne({ id: subjectId });

      const practices = [];

      for (const practiceId of subject?.practicesIds || []) {
        const practice = await practicesCollection.findOne({
          id: practiceId,
        });

        practice.currentStudentSchedule =
          userType === "student"
            ? await schedulesCollection.findOne({
                subjectId,
                practiceId,
                studentId: userId,
              })
            : undefined;

        practices.push(practice);
      }

      const group = {
        name: subject.name,
        semester,
        groupNumber,
        subjectId,
        id: groupId,
        practices,
      };

      groups.push(group);
    }

    return groups;
  } finally {
    await mongoClient.close();
  }
}

export async function updateSchedule(id, scheduleData) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster();
    const db = mongoClient.db("laboratorioremotofi");
    const schedulesCollection = db.collection("schedules");

    const result = await schedulesCollection.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: scheduleData },
      { returnDocument: "after" }
    );

    return result;
  } finally {
    await mongoClient.close();
  }
}

export async function logScheduleEvent(id, message) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster();
    const db = mongoClient.db("laboratorioremotofi");
    const schedulesCollection = db.collection("schedules");

    const result = await schedulesCollection.findOneAndUpdate(
      { _id: ObjectId(id) },
      {
        $push: {
          log: { date: new Date(), message },
        },
      },
      { returnDocument: "after" }
    );

    return result;
  } finally {
    await mongoClient.close();
  }
}

export async function reserveSchedule(
  studentId,
  subjectId,
  practiceId,
  timestamp
) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster();
    const db = mongoClient.db("laboratorioremotofi");
    const schedulesCollection = db.collection("schedules");

    const alreadyReserved = await schedulesCollection.findOne({
      subjectId: subjectId,
      practiceId: practiceId,
      timestamp: timestamp,
    });

    if (alreadyReserved) throw "schedule is already reserved";

    await schedulesCollection.updateOne(
      {
        studentId: studentId,
        subjectId: subjectId,
        practiceId: practiceId,
      },
      { $set: { timestamp, status: "SCHEDULED", log: [] } },
      { upsert: true }
    );

    const reservedSchedule = await schedulesCollection.findOne({
      studentId,
      subjectId,
      practiceId,
    });

    return reservedSchedule;
  } catch (err) {
    throw new Error(err);
  } finally {
    await mongoClient.close();
  }
}

export async function getSchedules({ practiceId, subjectId }) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster();
    const db = mongoClient.db("laboratorioremotofi");
    const schedulesCollection = db.collection("schedules");

    const schedules = await schedulesCollection
      .find({ practiceId, subjectId })
      .toArray();

    return schedules;
  } finally {
    await mongoClient.close();
  }
}

export async function getSchedulePracticeIp({ scheduleId }) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster();
    const db = mongoClient.db("laboratorioremotofi");
    const schedulesCollection = db.collection("schedules");
    const practicesCollection = db.collection("practices");

    const schedule = await schedulesCollection.findOne({
      _id: ObjectId(scheduleId),
    });

    const practice = await practicesCollection.findOne({
      id: schedule.practiceId,
    });

    return practice.raspIp;
  } finally {
    await mongoClient.close();
  }
}

export async function getStudentsPracticeInfo({
  subjectId,
  groupNumber,
  practiceId,
}) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster();
    const db = mongoClient.db("laboratorioremotofi");
    const groupsCollection = db.collection("groups");
    const usersCollection = db.collection("users");
    const schedulesCollection = db.collection("schedules");
    const practicesCollection = db.collection("practices");
    const group = await groupsCollection.findOne({ subjectId, groupNumber });
    const studentsIds = group?.studentsIds;

    const practiceInfo = [];

    const practice = await practicesCollection.findOne({
      id: practiceId,
    });

    for (const index in studentsIds) {
      const studentId = studentsIds[index];
      const student = await usersCollection.findOne({
        id: studentId,
      });
      let schedule = await schedulesCollection.findOne({
        studentId,
        subjectId,
        practiceId,
      });
      let improvedStatus = getScheduleImprovedStatus({
        practiceStartDate: practice?.startDate,
        practiceEndDate: practice?.endDate,
        practiceTimeframe:
          practice?.timeFrame && practice?.timeFrame * 60 * 1000,
        scheduleTimestamp: schedule?.timestamp,
        scheduleStatus: schedule?.status,
      });
      if (!schedule) {
        schedule = {
          status: improvedStatus,
          timestamp: null,
          log: [],
        };
        improvedStatus = schedule.status;
      }
      const info = {
        id: studentId,
        name: student?.name,
        status: improvedStatus,
        timestamp: schedule?.timestamp,
        timeFrame: practice?.timeFrame,
        log: schedule?.log,
      };
      practiceInfo.push(info);
    }
    return practiceInfo;
  } finally {
    await mongoClient.close();
  }
}
