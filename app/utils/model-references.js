'use strict';

function getModelReferenceField(modelName) {
	return {
		type: 'ObjectId',
			ref: modelName
	};
}

module.exports = {
	USER: getModelReferenceField('User'),
	MOVIE: getModelReferenceField('Movie'),
	OPPORTUNITY: getModelReferenceField('Opportunity')
};