import { Pests } from '/imports/api/pests/pests.js';
import { CMS } from '/imports/api/cms/cms.js';
import { Meteor } from 'meteor/meteor';
import { Index, MinimongoEngine } from 'meteor/easy:search';
import './pest-library.html';

Template.pestsLib.onCreated(function () {
	Meteor.subscribe('pests.all');
	Meteor.subscribe('cms.all');
});

Template.pestsLib.onRendered(function() {
	Session.set("currentPage", "finalLib"); // set the current page to change banner
});


Template.pestsLib.helpers({

	getPestLibCMS(){
		return CMS.findOne({info:'finalLib'});
	},

	setPageSessions(type) {
		currentPest = type;
		var pestCount = Pests.find({'type': 'Pest', 'plant_affected': type}).count();
		var pestsPerPage = parseInt(CMS.findOne({info:'finalLib'}).pestsPerPage);

			Session.set(currentPest, 1);
			pestCount = pestCount%pestsPerPage == 0? Math.floor(pestCount/pestsPerPage) : Math.floor(pestCount/pestsPerPage+1);
			Session.set(currentPest + " Count", pestCount);
			console.log(Session.get(currentPest + " Count"));
	},

	getCurrentPestType(){
		return currentPest;
	},

	displayPest(type){
		var pestsPerPage = parseInt( CMS.findOne({info:'finalLib'}).pestsPerPage );
		return Pests.find({'type': 'Pest', 'plant_affected': type}, {sort: {name: 1}, skip:(Session.get(currentPest)-1)*pestsPerPage, limit:pestsPerPage});
	},

	setPagination(type){
		var count = Session.get(type + " Count");
		var pages = [];
		for(var i = 1; i<=count; i++)
			pages.push({num: i});
		return pages;
	},

	isCurrentPage(page){
		return Session.equals(currentPest, page);
	},
});

Template.pestsLib.events({
	'click .page-number'(event) {
		currentPest = $(event.target).attr("name");
		Session.set(currentPest, this.num); // stores the current page number of typeOfPest
		console.log(currentPest + " page: " + Session.get(currentPest));
	},
});

// FOR SEARCHING
const PestsIndex = new Index({
  collection: Pests,
  limit: 20,
  fields: ['eng_name', 'fil_name', 'sci_name', 'symptoms'],
  engine: new MinimongoEngine(),
});

Template.searchBar.helpers({
  pestsIndex: () => PestsIndex
});

