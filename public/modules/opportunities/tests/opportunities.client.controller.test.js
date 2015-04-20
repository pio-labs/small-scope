'use strict';

(function() {
	// Opportunities Controller Spec
	describe('Opportunities Controller Tests', function() {
		// Initialize global variables
		var OpportunitiesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Opportunities controller.
			OpportunitiesController = $controller('OpportunitiesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Opportunity object fetched from XHR', inject(function(Opportunities) {
			// Create sample Opportunity using the Opportunities service
			var sampleOpportunity = new Opportunities({
				name: 'New Opportunity'
			});

			// Create a sample Opportunities array that includes the new Opportunity
			var sampleOpportunities = [sampleOpportunity];

			// Set GET response
			$httpBackend.expectGET('opportunities').respond(sampleOpportunities);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.opportunities).toEqualData(sampleOpportunities);
		}));

		it('$scope.findOne() should create an array with one Opportunity object fetched from XHR using a opportunityId URL parameter', inject(function(Opportunities) {
			// Define a sample Opportunity object
			var sampleOpportunity = new Opportunities({
				name: 'New Opportunity'
			});

			// Set the URL parameter
			$stateParams.opportunityId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/opportunities\/([0-9a-fA-F]{24})$/).respond(sampleOpportunity);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.opportunity).toEqualData(sampleOpportunity);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Opportunities) {
			// Create a sample Opportunity object
			var sampleOpportunityPostData = new Opportunities({
				name: 'New Opportunity'
			});

			// Create a sample Opportunity response
			var sampleOpportunityResponse = new Opportunities({
				_id: '525cf20451979dea2c000001',
				name: 'New Opportunity'
			});

			// Fixture mock form input values
			scope.name = 'New Opportunity';

			// Set POST response
			$httpBackend.expectPOST('opportunities', sampleOpportunityPostData).respond(sampleOpportunityResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Opportunity was created
			expect($location.path()).toBe('/opportunities/' + sampleOpportunityResponse._id);
		}));

		it('$scope.update() should update a valid Opportunity', inject(function(Opportunities) {
			// Define a sample Opportunity put data
			var sampleOpportunityPutData = new Opportunities({
				_id: '525cf20451979dea2c000001',
				name: 'New Opportunity'
			});

			// Mock Opportunity in scope
			scope.opportunity = sampleOpportunityPutData;

			// Set PUT response
			$httpBackend.expectPUT(/opportunities\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/opportunities/' + sampleOpportunityPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid opportunityId and remove the Opportunity from the scope', inject(function(Opportunities) {
			// Create new Opportunity object
			var sampleOpportunity = new Opportunities({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Opportunities array and include the Opportunity
			scope.opportunities = [sampleOpportunity];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/opportunities\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOpportunity);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.opportunities.length).toBe(0);
		}));
	});
}());