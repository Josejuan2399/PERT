/**
 * @param {String} name 
 * @param {Number} duration 
 * @param {Number} cost 
 * @param  {...String} pre 
 */
export class Activity {
  constructor(name, worst, medium, best, cost, ...pre) {
    this.name = name;
    this.durations = { worst, medium, best };
    this.cost = cost;
    this.pre = [...pre];
    this.isDone = false;
    this.expectedTime = 0;
    this.vExpectedTime = 0;
  }
}

/**
 * @param {Number} adminExpenses 
 * @param  {Array<Activity>} activities
 */
export class PertData {
  constructor(adminExpenses, normalTotalCost,normalActivities, ...activities) {
    this.adminExpenses = adminExpenses;
    this.activities = [...activities]
    this.budget = [];
    this.totalCost = 0;
    this.totalDuration = 0;
    this.criticalPath = [];
    this.flatActivitiesDone = [];
    this.groupedActivitiesDone = [[]];
    this.sumOfExpectedTime = 0;

    // Reduced Data
    this.normalActivities = [...normalActivities];
    this.normalTotalCost = normalTotalCost;
    this.reducedAmount = 0;
  }

  doAll(isReduced) {
    this.setupActivities();
    this.setExpectedTimes();
    this.calculateTotalDuration();
    this.calculateReducedAmount()
    isReduced ? this.calculateReducedTotalCost() : this.calculateTotalCost()
    this.calculateBudget();
    this.calculateCriticalPath();
    this.sumExpectedTimes();
  }

  calculateReducedTotalCost() {
    console.log(`${this.normalTotalCost} + (${this.adminExpenses} * ${this.totalDuration}) + ${this.reducedAmount}`);
    this.totalCost = this.normalTotalCost + (this.adminExpenses * this.totalDuration) + this.reducedAmount;
  }

  calculateTotalCost() {
    const result = this.activities.reduce((total, { cost, durations }) => {
      return total + cost * durations.medium;
    }, 0);
    this.normalTotalCost = result
    this.totalCost = result + (this.adminExpenses * this.totalDuration);
  }

  calculateReducedAmount() {
    let result = 0;
    this.normalActivities.forEach((act, index) => {
      result += (act.expectedTime - this.activities[index].expectedTime.toFixed(2)) * this.activities[index].cost
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

  calculateCriticalPath() {
    this.groupedActivitiesDone = this.groupedActivitiesDone.filter(group => group.length > 0)
    this.criticalPath = this.groupedActivitiesDone
      .map(group => {
        return group.filter(act => act.durations.medium === this.getHighestDuration(group))
      });
  }

  calculateBudget() {
    const budget = []
    for (const group of this.groupedActivitiesDone) {
      const groupHighestDuration = this.getHighestDuration(group);
      for (let time = 1; time <= groupHighestDuration; time++) {
        budget.push(0)
        group.forEach(act => {
          if (time <= act.durations.medium) budget[budget.length - 1] += act.cost;
        });
      }
    }
    this.budget = budget;
  }

  setExpectedTimes() {
    this.activities.forEach(act => {
      act.expectedTime = this.calculateExpectedTime(act.durations)
      act.vExpectedTime = this.calculateVExpectedTime(act.durations)
    });
  }

  sumExpectedTimes() {
    const result = this.criticalPath.reduce((total, act) => total += act[0].vExpectedTime, 0);
    this.sumOfExpectedTime = Math.pow(result, 0.5).toFixed(2);
  }

  setupActivities() {
    this.flatActivitiesDone = [];
    this.groupedActivitiesDone = [[]];
    //By default these grab the ones without prerequisites
    this.activities.forEach(activity => activity.isDone = false)

    while (this.flatActivitiesDone.length !== this.activities.length) {
      let activitiesNotDone = this.activities.filter(act => !act.isDone);
      let activitiesReady = [];
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

  // Helper
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

  // Helper
  getHighestDuration(activityGroup) {
    return activityGroup.reduce(
      (max, { durations }) => (durations.medium > max ? durations.medium : max),
      0
    );
  }

  // Helper
  calculateExpectedTime({ worst, medium, best }) {
    // Formula given by Edward
    const result = worst + (4 * medium) + best;
    return result / 6;
  }

  // Helper
  calculateVExpectedTime({ worst, best }) {
    // Formula given by Edward
    const result = ((best - worst) / 6);
    return Math.pow(result, 2);
  }
}
