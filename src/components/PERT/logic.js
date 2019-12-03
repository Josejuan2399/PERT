/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
export class Activity {
  // eslint-disable-next-line max-params
  constructor(name, worst, medium, best, cost, reWorst, reMedium, reBest, reCost, ...pre) {
    this.name = name;
    this.durations = { worst, medium, best, reWorst, reMedium, reBest };
    this.cost = cost;
    this.reCost = reCost;
    this.pre = [...pre];
    this.isDone = false;
    this.expectedTime = 0;
    this.vExpectedTime = 0;
    this.reExpectedTime = 0;
    this.reVExpectedTime = 0;
  }
}

/**
 * @param {Number} adminExpenses
 * @param  {Array<Activity>} activities
 */
export class PertData {
  constructor(adminExpenses, dirtyTotalCost, ...activities) {
    this.adminExpenses = adminExpenses;
    this.activities = [...activities];
    this.totalCost = 0;
    this.reTotalCost = 0;
    this.totalDuration = 0;
    this.reTotalDuration = 0;
    this.criticalPath = [];
    this.flatActivitiesDone = [];
    this.groupedActivitiesDone = [[]];
    this.sumOfExpectedTime = 0;
    this.reSumOfExpectedTime = 0;

    this.dirtyTotalCost = dirtyTotalCost;
    this.reducedAmount = 0;
  }

  doAll() {
    this.setupActivities();
    this.setExpectedTimes();
    this.calculateTotalDuration();
    this.calculateReducedTotalDuration();
    this.calculateReducedAmount();
    this.calculateTotalCost();
    this.calculateReducedTotalCost();
    this.calculateCriticalPath();
    this.sumExpectedTimes();
    this.sumReducedExpectedTimes();
  }

  calculateReducedTotalCost() {
    this.reTotalCost = this.dirtyTotalCost + (this.adminExpenses * this.totalDuration) + this.reducedAmount;
  }

  calculateTotalCost() {
    const result = this.activities.reduce((total, { cost, durations }) => {
      return total + cost * durations.medium;
    }, 0);

    this.dirtyTotalCost = result;
    this.totalCost = result + (this.adminExpenses * this.totalDuration);
  }

  calculateReducedAmount() {
    let result = 0;

    this.activities.forEach((act) => {
      result += (act.expectedTime - act.reExpectedTime.toFixed(2)) * act.reCost;
    });
    this.reducedAmount = parseInt(result.toFixed(0));
  }

  calculateTotalDuration() {
    this.totalDuration = this.groupedActivitiesDone
      .map(group => {
        return this.getHighestDuration(group);
      })
      .reduce((total, curr) => total + curr, 0);
  }

  calculateReducedTotalDuration() {
    this.reTotalDuration = this.groupedActivitiesDone
      .map(group => {
        return this.getReducedHighestDuration(group);
      })
      .reduce((total, curr) => total + curr, 0);
  }

  calculateCriticalPath() {
    this.groupedActivitiesDone = this.groupedActivitiesDone.filter(group => group.length > 0);
    this.criticalPath = this.groupedActivitiesDone
      .map(group => {
        return group.filter(act => act.durations.medium === this.getHighestDuration(group));
      });
  }

  setExpectedTimes() {
    this.activities.forEach(act => {
      act.expectedTime = this.calculateExpectedTime(act.durations);
      act.vExpectedTime = this.calculateVExpectedTime(act.durations);
      act.reExpectedTime = this.calculateReducedExpectedTime(act.durations);
      act.reVExpectedTime = this.calculateReducedVExpectedTime(act.durations);
    });
  }

  sumExpectedTimes() {
    const result = this.criticalPath.reduce((total, act) => total += act[0].vExpectedTime, 0);
    this.sumOfExpectedTime = Math.pow(result, 0.5).toFixed(2);
  }

  sumReducedExpectedTimes() {
    const result = this.criticalPath.reduce((total, act) => total += act[0].reVExpectedTime, 0);
    this.reSumOfExpectedTime = Math.pow(result, 0.5).toFixed(2);
  }

  setupActivities() {
    this.flatActivitiesDone = [];
    this.groupedActivitiesDone = [[]];
    // By default these grab the ones without prerequisites
    this.activities.forEach(activity => activity.isDone = false);

    while (this.flatActivitiesDone.length !== this.activities.length) {
      const activitiesNotDone = this.activities.filter(act => !act.isDone),
        activitiesReady = [];

      let indexOfActivity;

      this.groupedActivitiesDone.push([]);

      // Check for activities that are ready to be processed / checkForReadyActivities / Helper
      for (const activity of activitiesNotDone) {
        if (this.canActivityProceed(activity)) {
          activitiesReady.push(activity.name);
        }
      }

      if (activitiesReady.length === 0) {
        console.error("There's an activity with invalid prerrequisites");
        return;
      }

      // Handles activities that are ready / handleReadyActivities / Helper
      for (const activity of activitiesReady) {
        indexOfActivity = this.activities.findIndex(act => {
          return act.name === activity;
        });
        this.activities[indexOfActivity].isDone = true;
        this.flatActivitiesDone.push(this.activities[indexOfActivity]);
        this.groupedActivitiesDone[this.groupedActivitiesDone.length - 1].push(
          this.activities[indexOfActivity]
        );
      }
    }
  }

  // **************************************************** HELPERS ****************************************************

  canActivityProceed(currentActivity) {
    if (currentActivity.pre.length === 0) return true;
    for (const currentPre of currentActivity.pre) {
      const canBeProceeded = !!this.flatActivitiesDone.find(act => {
        return act.name === currentPre;
      });

      if (canBeProceeded) {
        continue;
      } else return false;
    }
    return true;
  }

  getHighestDuration(activityGroup) {
    return activityGroup.reduce(
      (max, { durations }) => (durations.medium > max ? durations.medium : max),
      0
    );
  }

  getReducedHighestDuration(activityGroup) {
    return activityGroup.reduce(
      (max, { durations }) => (durations.reMedium > max ? durations.reMedium : max),
      0
    );
  }

  calculateExpectedTime({ worst, medium, best }) {
    const result = worst + (4 * medium) + best;
    return result / 6;
  }

  calculateReducedExpectedTime({ reWorst, reMedium, reBest }) {
    const result = reWorst + (4 * reMedium) + reBest;
    return result / 6;
  }

  calculateVExpectedTime({ worst, best }) {
    const result = ((best - worst) / 6);
    return Math.pow(result, 2);
  }

  calculateReducedVExpectedTime({ reWorst, reBest }) {
    const result = ((reBest - reWorst) / 6);
    return Math.pow(result, 2);
  }
}
