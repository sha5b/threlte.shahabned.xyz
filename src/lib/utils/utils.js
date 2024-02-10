//@ts-nocheck

import { Vector3 } from 'three';

/**
 * Checks if a given position overlaps with any existing positions in a collection.
 *
 * @param {Vector3} position - The position to check for overlap.
 * @param {Vector3} size - The size of the grid cell to use for checking overlap.
 * @param {Map} categoryPositions - A collection of other positions to check against.
 * @returns {boolean} True if there is an overlap, otherwise false.
 */
export function isOverlapping(position, size, categoryPositions) {
	for (let [otherPosition] of categoryPositions) {
		const isOverlapping =
			position.x < otherPosition.x + size.x &&
			position.x + size.x > otherPosition.x &&
			position.y < otherPosition.y + size.y &&
			position.y + size.y > otherPosition.y &&
			position.z < otherPosition.z + size.z &&
			position.z + size.z > otherPosition.z;

		if (isOverlapping) {
			console.log(`Overlap detected: ${JSON.stringify({ position, otherPosition, size })}`);
			return true;
		}
	}
	return false;
}

/**
 * Generates unique positions for each category on a grid within a given range, ensuring no overlaps.
 *
 * @param {Array} categories - An array of category objects, each with an id and size property.
 * @param {Vector3} range - The range of the grid in x, y, and z directions.
 * @param {Map} categoryPositions - A Map to store generated positions indexed by category id.
 */
export function generateUniquePositions(categories, range, categoryPositions, cellSize) {
	categories.forEach((category) => {
		let attempts = 0;
		let pos = getRandomGridPosition(range, category.size);
		pos = roundVectorToCellSize(pos, cellSize);
		while (isOverlapping(pos, category.size, categoryPositions)) {
			// console.log(`Overlap detected for category ID ${category.id} at position`, pos);
			if (++attempts > 100) {
				// Prevent infinite loops
				throw new Error('Too many attempts to find a non-overlapping position');
			}
			pos = getRandomGridPosition(range, category.size);
			pos = roundVectorToCellSize(pos, cellSize);
		}
		categoryPositions.set(category.id, pos);
		// console.log(`Position for category ID ${category.id} set to:`, pos);
	});
}

/**
 * Generates a random position on a grid within a given range, aligned to a specified size.
 *
 * @param {Vector3} range - The range of the grid in x, y, and z directions.
 * @param {Vector3} size - The size of the grid cell to align the position to.
 * @returns {Vector3} A Vector3 object representing the random position on the grid.
 */
export function getRandomGridPosition(range, size) {
	const step = Math.max(size.x, size.y, size.z);
	return new Vector3(
		Math.floor(Math.random() * ((range.x - size.x) / step)) * step - (range.x - size.x) / 2,
		Math.floor(Math.random() * ((range.y - size.y) / step)) * step - (range.y - size.y) / 2,
		Math.floor(Math.random() * ((range.z - size.z) / step)) * step - (range.z - size.z) / 2
	);
}

/**
 * Counts the number of works belonging to a specific category.
 *
 * @param {Array} works - The array of works to be filtered.
 * @param {string} categoryId - The ID of the category to count works for.
 * @returns {number} The count of works in the specified category.
 */
export function countWorksPerCategory(works, categoryId) {
	return works.filter((work) => work.category === categoryId).length;
}

/**
 * Calculates the scaled size of a vector by multiplying its components by a scalar factor.
 *
 * @param {Vector3} baseSize - The original size as a Vector3.
 * @param {number} scaleFactor - The factor by which to scale the size.
 * @returns {Vector3} The resulting scaled size as a new Vector3.
 */
export function calculateScaledSize(baseSize, scaleFactor) {
	return baseSize.multiplyScalar(scaleFactor);
}

/**
 * Rounds the components of a vector to the nearest multiple of a given cell size.
 *
 * @param {Vector3} vector - The vector to be rounded.
 * @param {number} cellSize - The cell size to round each component of the vector to.
 * @returns {Vector3} A new vector with each component rounded to the nearest cell size.
 */
export function roundVectorToCellSize(vector, cellSize) {
	return new Vector3(
		roundToCellSize(vector.x, cellSize),
		roundToCellSize(vector.y, cellSize),
		roundToCellSize(vector.z, cellSize)
	);
}

/**
 * Rounds the given value to the nearest multiple of the specified cell size.
 *
 * @param {number} value - The value to be rounded.
 * @param {number} cellSize - The cell size to round the value to.
 * @returns {number} The rounded value.
 */
export function roundToCellSize(value, cellSize) {
	return Math.round(value / cellSize) * cellSize;
}

/**
 * Creates an event handler function for box click events.
 *
 * @param {Function} dispatch - The dispatch function to emit custom events.
 * @param {Function} activeBoxSetter - A setter function to update the active box ID.
 * @returns {Function} A function to handle box click events.
 */
export function createBoxClickHandler(dispatch, activeBoxSetter) {
	return function handleBoxClick(event) {
		const { id } = event.detail;
		activeBoxSetter(id); // Call the setter function with the new active box ID
		dispatch('boxclick', event.detail);
	};
}

export function createWorkClickHandler(dispatch, activeBoxSetter) {
	return function handleWorkClick(event) {
		const { id } = event.detail;
		activeBoxSetter(id); // Call the setter function with the new active box ID
		dispatch('workclick', event.detail);
	};
}
