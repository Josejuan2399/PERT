export function isValueInAnotherArray(array, value) {
    if (array.find(elem => elem === value) === undefined) return true;
    else return false;
}