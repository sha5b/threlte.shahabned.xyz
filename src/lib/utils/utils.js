//@ts-nocheck
import { Vector3 } from 'three';

export function roundToCellSize(value, cellSize) {
	return Math.round(value / cellSize) * cellSize;
}

export function roundVectorToCellSize(vector, cellSize) {
	return new Vector3(
		roundToCellSize(vector.x, cellSize),
		roundToCellSize(vector.y, cellSize),
		roundToCellSize(vector.z, cellSize)
	);
}

export function getRandomGridPosition(range, size) {
	const step = Math.max(size.x, size.y, size.z);
	return new Vector3(
		Math.floor(Math.random() * ((range.x - size.x) / step)) * step - (range.x - size.x) / 2,
		Math.floor(Math.random() * ((range.y - size.y) / step)) * step - (range.y - size.y) / 2,
		Math.floor(Math.random() * ((range.z - size.z) / step)) * step - (range.z - size.z) / 2
	);
}

export function isOverlapping(position, size, categoryPositions) {
	for (let [_, otherPosition] of categoryPositions) {
		if (
			position.x < otherPosition.x + size.x &&
			position.x + size.x > otherPosition.x &&
			position.y < otherPosition.y + size.y &&
			position.y + size.y > otherPosition.y &&
			position.z < otherPosition.z + size.z &&
			position.z + size.z > otherPosition.z
		) {
			// Overlap detected
			return true;
		}
	}
	return false;
}

export function generateUniquePositions(categories, range, categoryPositions, cellSize) {
	categories.forEach((category) => {
		let attempts = 0;
		let pos;
		do {
			pos = roundVectorToCellSize(getRandomGridPosition(range, category.size), cellSize);
			attempts++;
			if (attempts > 100) {
				throw new Error('Too many attempts to find a non-overlapping position');
			}
		} while (isOverlapping(pos, category.size, categoryPositions));

		categoryPositions.set(category.id, pos);
	});
}

export function countWorksPerCategory(works, categoryId) {
	return works.filter((work) => work.category === categoryId).length;
}

export function calculateScaledSize(baseSize, scaleFactor) {
	return baseSize.multiplyScalar(scaleFactor);
}
