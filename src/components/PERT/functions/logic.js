/**
 * 
 * @param {String} name 
 * @param {Number} duration 
 * @param {Number} cost 
 * @param  {...String} pre 
 */
export function Activity(name, worst, medium, best, cost, ...pre) {
  this.name = name;
  this.durations = {worst, medium, best};
  this.cost = cost;
  this.pre = [...pre];
  this.isDone = false;
  this.expectedTime = 0;
  this.vExpectedTime = 0;
}

let flatActivitiesDone = [];
let groupedActivitiesDone = [[]];

// Main

/**
 * 
 * @param {Array<Activity>} activities 
 * @param {Number} adminExpenses 
 * @param {Number} totalDuration 
 */
export function calculateTotalCost(activities) {
  return (
    activities.reduce((total, { cost, durations }) => {
      return total + cost * durations.medium;
    }, 0)
  );
}

// Main
/**
 * 
 * @param {Array<Activity>} activities 
 * @param {Array<Array<Activity>>} groupedActivitiesDone 
 */
export function calculateTotalDuration() {
  return groupedActivitiesDone
    .map(group => {
      return getHighestDuration(group);
    })
    .reduce((total, curr) => total + curr, 0);
}

// Main
/**
 * 
 * @param {Array<Array<Activity>>} groupedActivitiesDone 
 */
export function calculateCriticalPath() {
  groupedActivitiesDone = groupedActivitiesDone.filter(group => group.length > 0)
  return groupedActivitiesDone
    .map(group => {
      return group.filter(act => act.durations.medium === getHighestDuration(group))
    });
}

// Main
export function calculateBudget() {
  const budget = []
  for (const group of groupedActivitiesDone) {
    const groupHighestDuration = getHighestDuration(group);
    for (let time = 1; time <= groupHighestDuration; time++) {
      budget.push(0)
      group.forEach(act => {
        if (time <= act.durations.medium) budget[budget.length - 1] += act.cost;
      });
    }
  }
  return budget;
}

/* Helper, basically does most part of the job, i think it can explain itself.
 */
/**
 * 
 * @param {Array<Activity>} activities 
 * @param {Array<Activity>} flatActivitiesDone 
 * @param {Array<Activity>} groupedActivitiesDone 
 */
export function setupActivities(activities) {
  //By default these grab the ones without prerequisites
  activities.forEach(activity => activity.isDone = false)

  while (flatActivitiesDone.length !== activities.length) {
    let activitiesNotDone = activities.filter(act => !act.isDone);
    let activitiesReady = [];
    let indexOfActivity;

    groupedActivitiesDone.push([]);

    // Check for activities that are ready to be processed / checkForReadyActivities / Helper
    for (const activity of activitiesNotDone) {
      if (canActivityProceed(activity, flatActivitiesDone)) {
        activitiesReady.push(activity.name);
      }
    }

    if (activitiesReady.length === 0) {
      console.error("There's an activity with invalid prerrequisites");
      return;
    }

    // Handles activities that are ready / handleReadyActivities / Helper
    for (const activity of activitiesReady) {
      indexOfActivity = activities.findIndex(act => {
        return act.name === activity;
      });
      activities[indexOfActivity].isDone = true;
      flatActivitiesDone.push(activities[indexOfActivity]);
      groupedActivitiesDone[groupedActivitiesDone.length - 1].push(
        activities[indexOfActivity]
      );
    }
  }
}

/* Helper, checks the that the prerequisites of an activity, 
returns true if all of its prerequisites are already done, else returns false.*/

/**
 * 
 * @param {Activity} currentActivity 
 * @param {Array<Activity>} activitiesDone 
 */
function canActivityProceed(currentActivity) {
  if (currentActivity.pre.length === 0) return true;
  for (const currentPre of currentActivity.pre) {
    const canBeProceeded = !!flatActivitiesDone.find(act => {
      return act.name === currentPre;
    });
    if (canBeProceeded) {
      continue;
    } else return false;
  }
  return true;
}

// Helper
/**
 * 
 * @param {Array<Array<Activity>>} activityGroup 
 */
function getHighestDuration(activityGroup) {
  return activityGroup.reduce(
    (max, { durations }) => (durations.medium > max ? durations.medium : max),
    0
  );
}

function calculateExpectedTime({worst, medium, best}) {
  // Formula given by Edward
  const result = worst + (4 * medium) + best;
  return result / 6;
}

function calculateVExpectedTime({worst, best}) {
  // Formula given by Edward
  const result = ((best - worst) / 6);
  return Math.pow(result, 2);
}

export function setExpectedTimes(activities) {
  activities.forEach(act => {
    act.expectedTime = calculateExpectedTime(act.durations)
    act.vExpectedTime = calculateVExpectedTime(act.durations)
  });
  return activities;
}

export function sumExpectedTimes(criticalPath) {
  const result = criticalPath.reduce((total, act) => total += act[0].vExpectedTime, 0);
  return Math.pow(result, 0.5).toFixed(2);
}
