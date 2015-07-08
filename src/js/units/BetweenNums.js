module.exports = function(numGiven, numToCheck, ratio) {
    return numGiven >= numToCheck - ratio && numGiven <= numToCheck + ratio;
};