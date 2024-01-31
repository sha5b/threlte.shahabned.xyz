import { Vector3 } from 'three';

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
			return true;
		}
	}
	return false;
}

export function generateUniquePositions(categories, range, categoryPositions) {
	categories.forEach((category) => {
		let pos = getRandomGridPosition(range, category.size);
		while (isOverlapping(pos, category.size, categoryPositions)) {
			pos = getRandomGridPosition(range, category.size);
		}
		categoryPositions.set(category.id, pos);
	});
}

export function countWorksPerCategory(works, categoryId) {
    return works.filter((work) => work.category === categoryId).length;
}

export function calculateScaledSize(baseSize, scaleFactor) {
	return baseSize.multiplyScalar(scaleFactor);
}


export function roundVectorToCellSize(vector, cellSize) {
	return new Vector3(
		roundToCellSize(vector.x, cellSize),
		roundToCellSize(vector.y, cellSize),
		roundToCellSize(vector.z, cellSize)
	);
}


function roundToCellSize(value, cellSize) {
	return Math.round(value / cellSize) * cellSize;
}


export function createBoxClickHandler(dispatch, activeBoxSetter) {
	return function handleBoxClick(event) {
		const { id } = event.detail;
		activeBoxSetter(id); // Call the setter function with the new active box ID
		dispatch('boxclick', event.detail);
	};
}

