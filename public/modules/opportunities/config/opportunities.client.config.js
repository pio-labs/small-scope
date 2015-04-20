'use strict';

// Configuring the Articles module
angular.module('opportunities').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Opportunities', 'opportunities', 'dropdown', '/opportunities(/create)?');
		Menus.addSubMenuItem('topbar', 'opportunities', 'List Opportunities', 'opportunities');
		Menus.addSubMenuItem('topbar', 'opportunities', 'New Opportunity', 'opportunities/create');
	}
]);