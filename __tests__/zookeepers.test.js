const fs = require('fs');
const {
	filterByQuery,
	findById,
	createNewZookeeper,
	validateZookeeper
} = require('../lib/zookeepers');
const { zookeepers } = require('../data/zookeepers');

jest.mock('fs');

test('creates a zookeeper object', () => {
	const zookeeper = createNewZookeeper({ name: 'jebidoe', id: ';lj;jjds' }, zookeepers);

	expect(zookeeper.name).toBe('jebidoe');
	expect(zookeeper.id).toBe(';lj;jjds');
});

test('filters by query', () => {
	const startingZookeepers = [
		{
			id             : '0',
			name           : 'Kim',
			age            : 28,
			favoriteAnimal : 'dolphin'
		},
		{
			id             : '1',
			name           : 'Raksha',
			age            : 31,
			favoriteAnimal : 'penguin'
		}
	];

	const updatedZookeepers = filterByQuery(
		{ favoriteAnimal: 'dolphin' },
		startingZookeepers
	);

	expect(updatedZookeepers.length).toEqual(1);
});

test('finds by id', () => {
	const startingZookeepers = [
		{
			id             : '0',
			name           : 'Kim',
			age            : 28,
			favoriteAnimal : 'dolphin'
		},
		{
			id             : '1',
			name           : 'Raksha',
			age            : 31,
			favoriteAnimal : 'penguin'
		}
	];

	const result = findById('0', startingZookeepers);

	expect(result.name).toBe('Kim');
});

test('validates age', () => {
	const zookeeper = {
		id             : '1',
		name           : 'Raksha',
		age            : 31,
		favoriteAnimal : 'penguin'
	};

	const invalidZookeeper = {
		id             : '1',
		name           : 'Raksha',
		age            : '67',
		favoriteAnimal : 'penguin'
	};

	const result = validateZookeeper(zookeeper);
	const result2 = validateZookeeper(invalidZookeeper);

	expect(result).toBe(true);
	expect(result2).toBe(false);
});
