/** 
 * Contract solver.
 * @param {String} type Contract name
 * @param {*} data Contract data (comes in many forms)
 * @return {String|Number} Contract solution
 */
export function solveContract(type, data) {
	let contracts = {
		"Algorithmic Stock Trader I": curry(algorithmicStockTrader)(1),
		"Algorithmic Stock Trader II": curry(algorithmicStockTrader)(2),
		"Algorithmic Stock Trader III": curry(algorithmicStockTrader)(3),
		"Algorithmic Stock Trader IV": curry(algorithmicStockTrader)(4),
		"Array Jumping Game": arrayJumpingGame,
		"Find All Valid Math Expressions": findAllValidMathExpressions,
		"Find Largest Prime Factor": findLargestPrimeFactor,
		"Generate IP Addresses": generateIPAddresses,
		"Merge Overlapping Intervals": mergeOverlappingIntervals,
		"Minimum Path Sum in a Triangle": minimumPathSuminaTriangle,
		"Sanitize Parentheses in Expression": sanitizeParenthesesinExpression,
		"Spiralize Matrix": spiralizeMatrix,
		"Subarray with Maximum Sum": subarraywithMaximumSum,
		"Total Ways to Sum": totalWaystoSum,
		"Unique Paths in a Grid I": uniquePathsinaGridI,
		"Unique Paths in a Grid II": uniquePathsinaGridII,
	}
	if (contracts[type]) {
		return contracts[type](data);
	}
	return null;
}

/**
 * Helper function for algorithmicStockTrader.
 * Makes f take multiple parameters one at a time.
 * @param {Function} f Function to curry
 */
function curry(f) {
	return function (a) {
		return function (b) {
			return f(a, b);
		};
	};
}

/**
 * You are given an array of numbers representing stock prices,
 * where the i-th element represents the stock price on day i.
 * Determine the maximum possible profit you can earn using 
 * transactionLimit transactions. A transaction is defined as
 * buying and then selling one share of the stock. Note that you
 * cannot engage in multiple transactions at once.
 * In other words, you must sell the stock before you buy it again.
 * If no profit can be made, then the answer should be 0.
 * @param {Number} type Type of contract (1, 2, 3 or 4)
 * @param {Array | [Number, [Number]]} data 
 * @returns {Number}
 */
function algorithmicStockTrader(type, data) {
	let transactionLimit;
	let stocksArray;
	switch (type) {
		case 1:
			transactionLimit = 1;
			stocksArray = data;
			break;
		case 2:
			// As many as you like (i think the limit is data.length/2 + 1)
			transactionLimit = data.length;
			stocksArray = data;
			break;
		case 3:
			transactionLimit = 2;
			stocksArray = data;
			break;
		case 4:
			transactionLimit = data[0];
			stocksArray = data[1];
			break;
		default:
			return null;
	}
	return null;
}

/**
 * You are given an array of integers where each element represents
 * the maximum possible jump distance from that position.
 * For example, if you are at position i and your maximum jump
 * length is n, then you can jump to any position from i to i+n.
 * Assuming you are initially positioned at the start of the array,
 * determine whether you are able to reach the last index of the array EXACTLY.
 * @param {Array} data 
 * @returns {Number} 0 or 1
 */
function arrayJumpingGame(data) {
	let arr = data;
	return null;
}

/**
 * You are given a string which contains only digits between 0 and 9
 * as well as a target number. Return all possible ways you can add the
 * +, -, and * operators to the string of digits such that it evaluates
 * to the target number. Numbers in an expression cannot have leading 0’s.
 * @param {[String, Number]} data 
 * @returns {[String]}
 */
function findAllValidMathExpressions(data) {
	let string = data[0];
	let targetNumber = data[1];
	return null;
}

/**
 * Given a number, find its largest prime factor.
 * A prime factor is a factor that is a prime number.
 * @param {Number} data 
 * @returns {Number}
 */
function findLargestPrimeFactor(data) {
	let number = data;
	return null;
}

/**
 * Given a string containing only digits, return an array with all possible
 * valid IP address combinations that can be created from the string.
 * An octet in the IP address cannot begin with ‘0’ unless the number
 * itself is actually 0. For example, “192.168.010.1” is NOT a valid IP.
 * @param {String} data String of digits
 * @returns {[String]} Array with strings.
 */
function generateIPAddresses(data) {
	let string = data;
	return null;
}

/**
 * Given an array of intervals, merge all overlapping intervals.
 * An interval is an array with two numbers, where the first
 * number is always less than the second (e.g. [1, 5]).
 * The intervals must be returned in ASCENDING order.
 * @param {[[Number]]} data Array of arrays of 2 numbers
 * @returns {[[Number]]} Array of arrays of 2 numbers
 */
function mergeOverlappingIntervals(data) {
	let arr = data;
	return null;
}

/**
 * You are given a 2D array of numbers (array of array of numbers) that
 * represents a triangle (the first array has one element, and each array
 * has one more element than the one before it, forming a triangle).
 * Find the minimum path sum from the top to the bottom of the triangle.
 * In each step of the path, you may only move to adjacent numbers in the row below.
 * @param {[[Number]]} data Triangle
 * @returns {Number}
 */
function minimumPathSuminaTriangle(data) {
	let matrix = data;
	return null;
}

/**
 * Given a string with parentheses and letters, remove the minimum number of
 * invalid parentheses in order to validate the string. If there are multiple
 * minimal ways to validate the string, provide all of the possible results.
 * If it is impossible to validate the string, the result should be an array
 * with only an empty string.
 * @param {String} data 
 * @returns {[String]}
 */
function sanitizeParenthesesinExpression(data) {
	let string = data;
	return null;
}

/**
 * Given an array of array of numbers representing a 2D matrix,
 * return the elements of that matrix in clockwise spiral order.
 * @param {[[Number]]} data Matrix
 * @returns {Array}
 */
function spiralizeMatrix(data) {
	let matrix = data;
	return null;
}

/**
 * Given an array of integers, find the contiguous subarray (containing
 * at least one number) which has the largest sum and return that sum.
 * @param {Array} data 
 * @returns {Number}
 */
function subarraywithMaximumSum(data) {
	let arr = data;
	return null;
}

/**
 * Given a number, how many different ways can that number
 * be written as a sum of at least two positive integers?
 * @param {Number} data 
 * @returns {Array}
 */
function totalWaystoSum(data) {
	let number = data;
	return null;
}

/**
 * You are given an array with two numbers: [m, n]. These numbers represent
 * a m x n grid. Assume you are initially positioned in the top-left corner
 * of that grid and that you are trying to reach the bottom-right corner.
 * On each step, you may only move down or to the right.
 * Determine how many unique paths there are from start to finish.
 * @param {[Number]} data Array with grid dimensions
 * @returns {Number}
 */
function uniquePathsinaGridI(data) {
	let m = data[0];
	let n = data[1];
	return null;
}

/**
 * You are given a 2D array of numbers (array of array of numbers)
 * representing a grid. The 2D array contains 1’s and 0’s, where 1
 * represents an obstacle and 0 represents a free space.
 * Assume you are initially positioned in top-left corner of that
 * grid and that you are trying to reach the bottom-right corner.
 * In each step, you may only move down or to the right.
 * Furthermore, you cannot move onto spaces which have obstacles.
 * Determine how many unique paths there are from start to finish.
 * @param {[[Number]]} data Matrix with numbers
 * @returns {Number}
 */
function uniquePathsinaGridII(data) {
	let matrix = data;
	return null;
}