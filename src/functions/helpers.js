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

export function hasUniqueName(activities, newActivityName) {
    for (const activity of activities) {
        if (activity.name === newActivityName) return false;
    }
    return true;
}

export function isNameRepeated(array) {
    for (const element of array) {
        if (array.filter(el => el.name === element.name).length >= 2) return true;
    }
    return false;
}

// Currently does not support duration for CPM
export function isAnyFieldEmpty(array) {
    for (const { name, cost, durations: {worst, medium, best} } of array) {
        if (name === ''
            || isNaN(cost)
            || isNaN(worst)
            || isNaN(medium)
            || isNaN(best)
            )
            return true;
    }
    return false;
}
