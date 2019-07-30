export function isValueInAnotherArray(array, value) {
    if (array.find(elem => elem === value) === undefined) return true;
    else return false;
}

export function canRemoveActivity(activities, activityName) {
    for (const activity of activities) {
        for (const p of activity.pre) {
            if (p === activityName) return false
        }
    }
    return true;
}