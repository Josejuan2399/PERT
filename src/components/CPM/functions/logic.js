/**
 * 
 * @param {String} name 
 * @param {Number} duration 
 * @param {Number} cost 
 * @param  {...String} pre 
 */
export function Activity(name = "", duration = 0, cost = 0, ...pre) {
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
export function calculateTotalCost(activities) {
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
  groupedActivitiesDone = groupedActivitiesDone.filter(group => group.length > 0)
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
      budget.push(0)
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
function canActivityProceed(currentActivity, flatActivitiesDone) {
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
    (max, { duration }) => (duration > max ? duration : max),
    0
  );
}
