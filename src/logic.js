/**
 * 
 * @param {String} name 
 * @param {Number} duration 
 * @param {Number} cost 
 * @param  {...String} pre 
 */
export function Activity(name, duration, cost, ...pre) {
  this.name = name;
  this.duration = duration;
  this.cost = cost;
  this.pre = pre;
  this.isDone = false;
}

/* When we are entering data and before we start to calculate, 
we must do some checks: 

- Check that there's at least 1 activity with no prerequirements
- Check that all prerequirements have been declared as an activity
 */

// Main

/**
 * 
 * @param {Array<Activity>} activities 
 * @param {Number} adminExpenses 
 * @param {Number} totalDuration 
 */
export function calculateTotalCost(activities, totalDuration, adminExpenses) {
  return (
    activities.reduce((total, { cost, duration }) => {
      return total + cost * duration;
    }, 0)
  );
}

// Main
/**
 * 
 * @param {Array<Activity>} activities 
 * @param {Array<Array<Activity>>} groupedActivitiesDone 
 */
export function calculateTotalDuration(activities, groupedActivitiesDone, flatActivitiesDone) {
  handleActivities(activities, flatActivitiesDone, groupedActivitiesDone);
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
export function calculateCriticalPath(groupedActivitiesDone) {
  return groupedActivitiesDone
    .map(group => {
      return group.filter(act => act.duration === getHighestDuration(group))
    });
}

// Main
export function calculateBudget(groupedActivities, adminExpenses) {
  const budget = []
  for (const group of groupedActivities) {
    const groupHighestDuration = getHighestDuration(group);
    for (let time = 1; time <= groupHighestDuration; time++) {
      budget.push(adminExpenses)
      group.forEach(act => {
        if (time <= act.duration) budget[budget.length - 1] += act.cost;
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
function handleActivities(activities, flatActivitiesDone, groupedActivitiesDone) {
  //By default these grab the ones without prerequisites

  while (flatActivitiesDone.length !== activities.length) {
    let activitiesNotDone = activities.filter(act => !act.isDone);
    let activitiesReady = [];
    let indexOfActivity;

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
    if (indexOfActivity !== activities.length - 1)
      groupedActivitiesDone.push([]);
  }
}

/* Helper, checks the that the prerequisites of an activity, 
returns true if all of its prerequisites are already done, else returns false.*/

/**
 * 
 * @param {Activity} currentActivity 
 * @param {Array<Activity>} activitiesDone 
 */
function canActivityProceed(currentActivity, flatActivitiesDone) {
  /* If the required activities are more than the ones done, then 
  the current one is not eligible just yet.*/
  if (currentActivity.pre.length > flatActivitiesDone.length) return false;
  else {
    /* If there are more than one pre required activity, then we must check
  that all of them are in the flatActivitiesDone List. */
    for (const currentPre of currentActivity.pre) {
      const canBeProceeded = !!flatActivitiesDone.find(act => {
        return act.name === currentPre;
      });
      if (canBeProceeded) {
        continue;
      } else return false;
    }
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
    (max, { duration }) => (duration > max ? duration : max),
    0
  );
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SAMPLES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// const data = [
//   new Activity("A", 10, 100000),
//   new Activity("B", 5, 500000),
//   new Activity("C", 1, 1000000, "A", "B"),
//   new Activity("D", 9, 2000000, "C"),
//   new Activity("E", 7, 800000, "C"),
//   new Activity("F", 1, 1500000, "D", "E"),
//   new Activity("G", 4, 600000, "D", "E")
// ];

// const adminExpenses = 50000;

// Basically, all activities that are done.
// let flatActivitiesDone = [];  // Initialize like this
// let groupedActivitiesDone = [[]]; // Initialize like this

// const totalDuration = calculateTotalDuration(data, groupedActivitiesDone, flatActivitiesDone);
// const totalCost = calculateTotalCost(data, totalDuration, adminExpenses);
// const criticalPath = calculateCriticalPath(groupedActivitiesDone);
// const budget = calculateBudget(groupedActivitiesDone);

// console.log(totalDuration)
// console.log(totalCost)
// criticalPath.forEach(element => {
//   console.log(element[0].name);
// });

// console.log(budget)
