const studentMockData = {
  user: {
    id: 0,
    type: "student", //student - professor
    email: "abc@gmail.com",
    name: "Alex",
    groupsIds: ["2021-2_1500_2", "2021-2_1501_3", "2021-2_1502_1"],
    //reservedSchedules: [
    //  { practiceId: 1500, day: [2022, 1, 8], time: [10, 0] },
    //],
  },
  subjects: {
    1500: {
      id: 1500,
      name: "Mecánica",
      practicesIds: ["1500-1", "1500-2", "1500-3", "1500-4", "1500-5"],
    },
    1501: {
      id: 1501,
      name: "Cinemática",
      practicesIds: ["1501-1", "1501-2", "1501-3", "1501-4"],
    },
    1502: {
      id: 1502,
      name: "Dinámica",
      practicesIds: ["1502-1", "1502-2", "1502-3", "1502-4"],
    },
  },
  groups: {
    "2021-2_1500_2": {
      id: "2021-2_1500_2",
      semester: "2021-2",
      subjectId: 1500,
      groupNumber: 2,
    },
    "2021-2_1501_3": {
      id: "2021-2_1501_3",
      semester: "2021-2",
      subjectId: 1501,
      groupNumber: 3,
    },
    "2021-2_1502_1": {
      id: "2021-2_1502_1",
      semester: "2021-2",
      subjectId: 1502,
      groupNumber: 1,
    },
  },
  practices: {
    "1500-1": {
      id: "1500-1",
      name: "Plano inclinado 1",
      practiceNumber: 1,
      raspIp: "256.256.000.000",
      startDate: new Date("2022-01-24T07:00").getTime(),
      endDate: new Date("2022-01-28T18:00").getTime(),
      timeFrame: 45, // Minutes
      invalidWeekdays: [0, 6],
      currentStudentSchedule: NaN,
      reservedSchedules: [
        // Another option (put student id here and remove "reservedSchedules" from user object):
        //[1, 2022, 1, 8, 10, 0] // -> [studentId, year, month, day, hour, minute]
        //[2022, 1, 8, 10, 0],
        { studentId: 0, schedule: new Date("2022-01-25T07:45").getTime() },
        { studentId: 10, schedule: new Date("2022-02-02T08:30").getTime() },
      ],
    },
    "1500-2": {
      id: "1500-2",
      name: "Plano inclinado 2",
      practiceNumber: 2,
      raspIp: "256.256.000.000",
      startDate: new Date("2022-01-31T07:00").getTime(),
      endDate: new Date("2022-02-11T19:00").getTime(),
      timeFrame: 40,
      invalidWeekdays: [0, 6],
      currentStudentSchedule: NaN,
      reservedSchedules: [
        // Reserved start times and days
        { studentId: 0, schedule: new Date("2022-01-31T08:20").getTime() },
        { studentId: 1, schedule: new Date("2022-01-31T09:40").getTime() },
        { studentId: 2, schedule: new Date("2022-02-01T07:00").getTime() },
        { studentId: 10, schedule: new Date("2022-02-02T10:20").getTime() },
      ],
    },
    "1500-3": {
      id: "1500-3",
      name: "Plano inclinado 3",
      practiceNumber: 3,
      raspIp: "256.256.000.000",
      startDate: new Date("2022-02-14T07:00").getTime(),
      endDate: new Date("2022-02-18T19:00").getTime(),
      timeFrame: 30,
      invalidWeekdays: [0, 6],
      currentStudentSchedule: NaN,
      reservedSchedules: [
        // Reserved start times and days
        { studentId: 10, schedule: new Date("2022-02-14T07:30").getTime() },
      ],
    },
    "1500-4": {
      id: "1500-4",
      name: "Plano inclinado 4",
      practiceNumber: 4,
      raspIp: "256.256.000.000",
      startDate: new Date("2022-02-21T07:00").getTime(),
      endDate: new Date("2022-03-04T19:00").getTime(),
      timeFrame: 50,
      invalidWeekdays: [0, 6],
      currentStudentSchedule: NaN,
      reservedSchedules: [
        // Reserved start times and days
        { studentId: 0, schedule: new Date("2022-02-21T07:00").getTime() },
        { studentId: 10, schedule: new Date("2022-02-21T08:40").getTime() },
        { studentId: 3, schedule: new Date("2022-03-04T08:40").getTime() },
      ],
    },
    "1500-5": {
      id: "1500-5",
      name: "Plano inclinado 5",
      practiceNumber: 5,
      raspIp: "256.256.000.000",
      startDate: new Date("2022-03-07T07:00").getTime(),
      endDate: new Date("2022-04-29T22:00").getTime(),
      timeFrame: 30,
      invalidWeekdays: [0, 6],
      currentStudentSchedule: NaN,
      reservedSchedules: [
        // Reserved start times and days
        { studentId: 5, schedule: new Date("2022-03-07T07:30").getTime() },
        { studentId: 7, schedule: new Date("2022-03-07T09:00").getTime() },
      ],
    },
    "1501-1": {
      id: "1501-1",
      name: "Fricción 1",
      practiceNumber: 1,
      raspIp: "256.256.000.000",
      startDate: new Date("2022-01-24T07:00").getTime(),
      endDate: new Date("2022-01-28T19:00").getTime(),
      timeFrame: 60,
      invalidWeekdays: [0, 6],
      currentStudentSchedule: NaN,
      reservedSchedules: [
        // Reserved start times and days
      ],
    },
    "1501-2": {
      id: "1501-2",
      name: "Fricción 2",
      practiceNumber: 2,
      raspIp: "256.256.000.000",
      startDate: new Date("2022-01-31T07:00").getTime(),
      endDate: new Date("2022-02-04T21:00").getTime(),
      timeFrame: 60,
      invalidWeekdays: [0, 6],
      currentStudentSchedule: NaN,
      reservedSchedules: [
        // Reserved start times and days
        { studentId: 0, schedule: new Date("2022-02-04T20:00").getTime() },
      ],
    },
    "1501-3": {
      id: "1501-3",
      name: "Fricción 3",
      practiceNumber: 3,
      raspIp: "256.256.000.000",
      startDate: new Date("2022-02-07T07:00").getTime(),
      endDate: new Date("2022-02-11T19:00").getTime(),
      timeFrame: 60,
      invalidWeekdays: [0, 6],
      currentStudentSchedule: NaN,
      reservedSchedules: [
        // Reserved start times and days
      ],
    },
    "1501-4": {
      id: "1501-4",
      name: "Fricción 4",
      practiceNumber: 4,
      raspIp: "256.256.000.000",
      startDate: new Date("2022-02-14T07:00").getTime(),
      endDate: new Date("2022-04-29T22:00").getTime(),
      timeFrame: 40,
      invalidWeekdays: [0, 6],
      currentStudentSchedule: NaN,
      reservedSchedules: [
        // Reserved start times and days
        { studentId: 0, schedule: new Date("2022-02-18T07:00").getTime() },
        { studentId: 6, schedule: new Date("2022-02-21T07:40").getTime() },
        { studentId: 2, schedule: new Date("2022-04-29T21:00").getTime() },
      ],
    },
    "1502-1": {
      id: "1502-1",
      name: "Caída libre 1",
      practiceNumber: 1,
      raspIp: "256.256.000.000",
      startDate: new Date("2022-01-24T07:00").getTime(),
      endDate: new Date("2022-01-28T18:00").getTime(),
      timeFrame: 60,
      invalidWeekdays: [0],
      currentStudentSchedule: NaN,
      reservedSchedules: [
        // Reserved start times and days
      ],
    },
    "1502-2": {
      id: "1502-2",
      name: "Caída libre 2",
      practiceNumber: 2,
      raspIp: "256.256.000.000",
      startDate: new Date("2022-01-31T07:00").getTime(),
      endDate: new Date("2022-02-04T21:00").getTime(),
      timeFrame: 50,
      invalidWeekdays: [0],
      currentStudentSchedule: NaN,
      reservedSchedules: [
        // Reserved start times and days
      ],
    },
    "1502-3": {
      id: "1502-3",
      name: "Caída libre 3",
      practiceNumber: 3,
      raspIp: "256.256.000.000",
      startDate: new Date("2022-02-07T07:00").getTime(),
      endDate: new Date("2022-02-11T22:00").getTime(),
      timeFrame: 60,
      invalidWeekdays: [0],
      currentStudentSchedule: NaN,
      reservedSchedules: [
        // Reserved start times and days
      ],
    },
    "1502-4": {
      id: "1502-4",
      name: "Caída libre 4",
      practiceNumber: 4,
      raspIp: "256.256.000.000",
      startDate: new Date("2022-02-14T07:00").getTime(),
      endDate: new Date("2022-04-29T22:00").getTime(),
      timeFrame: 45,
      invalidWeekdays: [0],
      currentStudentSchedule: NaN,
      reservedSchedules: [
        // Reserved start times and days
        { studentId: 6, schedule: new Date("2022-03-22T07:45").getTime() },
        { studentId: 9, schedule: new Date("2022-04-29T07:00").getTime() },
      ],
    },
  },
};

export default studentMockData;
