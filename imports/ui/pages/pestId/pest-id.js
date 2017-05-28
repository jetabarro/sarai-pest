import { Plant_Problem, PestsIndex } from '/imports/api/plant_problem/plant_problem.js';
import { CMS } from '/imports/api/cms/cms.js';
import { Meteor } from 'meteor/meteor';
import './pest-id.html';
import '../library/pest-library/pest-library.html'

var currentPests = "";
var currentType = "";
var cropAffected = "";
var classType = "";

Template.pestId.onCreated(function () {
	Meteor.subscribe('plant_problem.all');
	Meteor.subscribe('cms.all');
	this.templateDict = new ReactiveDict();
	this.templateDict.set('currentType', currentType);
	this.templateDict.set('cropAffected', cropAffected);
	this.templateDict.set('classType', classType);
	this.templateDict.set('showResult', false);
	/*Session.set("currentType", currentType);
	Session.set("cropAffected", cropAffected);
	Session.set("classType", classType);
	Session.set("showResult", false);*/

});

Template.pestId.onRendered(function() {
	Session.set("currentPage", "finalId"); // set the current page to change banner
});

Template.pestId.helpers({

	pestsIndex(){
		return PestsIndex
	},

	searchAttributes() {
	    return {
	      placeholder: 'Search',
	      class: 'form-control'
	    };
  	},

  	equals: function(v1, v2) {
		return (v1 === v2);
	},

	getCMS(){
		return CMS.findOne({info:'finalLib'});
	},

	getType(){
		return Plant_Problem.find({})
	},

	setPageSessionsNew(type) {
		var typePerPage = 4;
		Session.set(type, 1);
		Session.set(type + " Count", type);
	},

	setPageSessions(type) {
		currentPest = type;
		var pestCount = Plant_Problem.find({'type': type}).count();
		var pestsPerPage = 4;
		Session.set(currentPest, 1);

		pestCount = pestCount%pestsPerPage == 0? Math.floor(pestCount/pestsPerPage) : Math.floor(pestCount/pestsPerPage+1);
		Session.set(currentPest + " Count", pestCount);
	},

	getCurrentPestType(){
		return currentPest;
	},

	displayPest(type){
		var pestsPerPage = 4;
		return Plant_Problem.find({'type': type}, {sort: {name: 1}, skip:(Session.get(currentPest)-1)*pestsPerPage, limit:pestsPerPage});
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

	displayInitial(type){
		var limitPerPage = 4;
		currentType = Template.instance().templateDict.get("currentType");
		cropAffected = Template.instance().templateDict.get("cropAffected");
		classType = Template.instance().templateDict.get("classType");
		if(currentType == "Pest" && (classType == "Fungal" || classType == "Bacterial" || classType == "Viral")){
			classType = Template.instance().templateDict.set("classType", "");
		}
		else if(currentType == "Disease" && (classType == "Fly-like" || classType == "Caterpillar-like" || classType == "Maggot" || classType == "Beetle-like" || classType == "Moth-like" || classType == "Two or one unit body")){
			classType = Template.instance().templateDict.set("classType", "");
		}

		if(currentType != "" && cropAffected == "" && classType == ""){
			return Plant_Problem.find({'type': currentType}, {sort: {name: 1}});
		}
		else if(cropAffected == "" && classType != ""){
			return Plant_Problem.find({'type': currentType, 'classification': classType}, {sort: {name: 1}});
		}
		else if(currentType == "" && cropAffected != "" && classType == ""){
			return Plant_Problem.find({'plant_affected': cropAffected}, {sort: {name: 1}});
		}
		else if(currentType != "" && cropAffected != "" && classType == ""){
			return Plant_Problem.find({'type': currentType, 'plant_affected': cropAffected}, {sort: {name: 1}});
		}
		else{
			return Plant_Problem.find({'type': currentType, 'plant_affected': cropAffected, 'classification': classType}, {sort: {name: 1}});
		}

		/*currentType = Session.get("currentType");
		cropAffected = Session.get("cropAffected");
		classType = Session.get("classType");
		if(currentType == "Pest" && (classType == "Fungal" || classType == "Bacterial" || classType == "Viral")){
			classType = Session.set("classType", "");
		}
		else if(currentType == "Disease" && (classType == "Fly-like" || classType == "Caterpillar-like" || classType == "Maggot" || classType == "Beetle-like" || classType == "Moth-like" || classType == "Two or one unit body")){
			classType = Session.set("classType", "");
		}

		if(currentType != "" && cropAffected == "" && classType == ""){
			return Plant_Problem.find({'type': currentType}, {sort: {name: 1}});
		}
		else if(cropAffected == "" && classType != ""){
			return Plant_Problem.find({'type': currentType, 'classification': classType}, {sort: {name: 1}});
		}
		else if(currentType == "" && cropAffected != "" && classType == ""){
			return Plant_Problem.find({'plant_affected': cropAffected}, {sort: {name: 1}});
		}
		else if(currentType != "" && cropAffected != "" && classType == ""){
			return Plant_Problem.find({'type': currentType, 'plant_affected': cropAffected}, {sort: {name: 1}});
		}
		else{
			return Plant_Problem.find({'type': currentType, 'plant_affected': cropAffected, 'classification': classType}, {sort: {name: 1}});
		}*/
	},

	showResult() {
		return Template.instance().templateDict.get("showResult");

		/*return Session.get("showResult");*/
	}
});

Template.pestId.events({
	'change [name="radiopd"]'(event, template) {
		currentType = $(event.target).attr("id");
		cropAffected = template.templateDict.get("cropAffected");
		classType = template.templateDict.get("classType");
		template.templateDict.set("currentType", currentType);
		template.templateDict.set("cropAffected", cropAffected);
		template.templateDict.set("classType", classType);
		template.templateDict.set("showResult", true);

		/*cropAffected = Session.get("cropAffected");
		classType = Session.get("classType");
		Session.set("currentType", currentType);
		Session.set("cropAffected", cropAffected);
		Session.set("classType", classType);
		Session.set("showResult", true);*/

		/*cropAffected = template.templateDict.get("cropAffected");
		if(currentType == "Pest"){
			template.templateDict.set("classType", "Fly-like");
			classType = template.templateDict.get("classType");
		}
		else{	
			template.templateDict.set("classType", "Fungal");
			classType = template.templateDict.get("classType");
		}
		if(currentType == "Pest" && cropAffected == ""){ //|| (classType == "Fungal" || classType == "Bacterial" || classType == "Viral"))){
			//Session.set("currentType", "Pest");
			template.templateDict.set("cropAffected", "Rice");
			console.log("pes");
		}
		else if(currentType == "Disease" && cropAffected == ""){
			//Session.set("currentType", "Disease");
			template.templateDict.set("cropAffected", "Rice");
			console.log("dis");
		}
		//setPageSessions(Session.get("currentType"));
		else{
			template.templateDict.set("cropAffected", cropAffected);
			template.templateDict.set("classType", classType);
		}*/

		console.log(template.templateDict.get("currentType"));
		console.log(template.templateDict.get("cropAffected"));
		console.log(template.templateDict.get("classType"));

		/*console.log(Session.get("currentType"));
		console.log(Session.get("cropAffected"));
		console.log(Session.get("classType"));*/
	},

	'change [name="cropAffected"]' (event, template) {
		cropAffected = "";
		var count = 0;
		currentType = template.templateDict.get("currentType");
		classType = template.templateDict.get("classType");

		/*currentType = Session.get("currentType");
		classType = Session.get("classType");*/

		event.preventDefault();
		$.each($('[name="cropAffected"]:checked'), function(index, item){
			let x = item.id;
			if(count === 0){
				cropAffected = x;
			}
			else{
				cropAffected = cropAffected + ', ' + x;
			}
			count++;
		});

		template.templateDict.set("currentType", currentType);
		template.templateDict.set("cropAffected", cropAffected);
		template.templateDict.set("classType", classType);
		template.templateDict.set("showResult", true);
		
		console.log(template.templateDict.get("currentType"));
		console.log(template.templateDict.get("cropAffected"));
		console.log(template.templateDict.get("classType"));

		/*Session.set("currentType", currentType);
		Session.set("cropAffected", cropAffected);
		Session.set("classType", classType);
		Session.set("showResult", true);

		console.log(Session.get("currentType"));
		console.log(Session.get("cropAffected"));
		console.log(Session.get("classType"));*/
	},

	'change [name="classType"]' (event, template) {
		classType = $(event.target).attr("id");
		currentType = template.templateDict.get("currentType");
		cropAffected = template.templateDict.get("cropAffected");
		template.templateDict.set("currentType", currentType);
		template.templateDict.set("cropAffected", cropAffected);
		template.templateDict.set("classType", classType);
		template.templateDict.set("showResult", true);

		console.log(template.templateDict.get("currentType"));
		console.log(template.templateDict.get("cropAffected"));
		console.log(template.templateDict.get("classType"));

		/*currentType = Session.get("currentType");
		cropAffected = Session.get("cropAffected");
		Session.set("currentType", currentType);
		Session.set("cropAffected", cropAffected);
		Session.set("classType", classType);
		Session.set("showResult", true);

		console.log(Session.get("currentType"));
		console.log(Session.get("cropAffected"));
		console.log(Session.get("classType"));*/
	},
});

