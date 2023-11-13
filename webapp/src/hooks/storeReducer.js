import { getNearestPractice } from "/src/utils/scheduleUtils";

const storeReducer = (state, action) => {
  switch (action.type) {
    case "setGroups":
      return {
        ...state,
        groups: action.groups,
      };
    case "calculateNearestPractice":
      return {
        ...state,
        nearestPractice: getNearestPractice(state.groups),
      };
    case "clearData":
      return {
        ...state,
        groups: null,
      };
    case "setDirectConnectionIp":
      return {
        ...state,
        nearestPractice: {
          ip: action.serverIp,
        },
      };
    case "setReservedSchedule": {
      const groupIndex = state.groups.findIndex(
        (group) => group.id === action.payload.groupId
      );
      const practiceIndex = state.groups[groupIndex].practices.findIndex(
        (practice) => practice.id === action.payload.reservedSchedule.practiceId
      );
      const updatedGroups = state.groups.map((group, i) =>
        i === groupIndex
          ? {
              ...group,
              practices: state.groups[groupIndex].practices.map((practice, j) =>
                j === practiceIndex
                  ? {
                      ...practice,
                      currentStudentSchedule: action.payload.reservedSchedule,
                    }
                  : practice
              ),
            }
          : group
      );

      return {
        ...state,
        groups: updatedGroups,
      };
    }
    default:
      return {
        ...state,
      };
  }
};

export default storeReducer;
