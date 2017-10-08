// helper function for token replacement (e.g. document.write("Hello {0}!".replaceTokens("World")) outputs "Hello World!")
String.prototype.replaceTokens = String.prototype.replaceTokens ||
function () {
	"use strict";
	var str = this.toString();
	if (arguments.length) {
		var t = typeof arguments[0];
		var key;
		var args = ("string" === t || "number" === t) ?
			Array.prototype.slice.call(arguments)
			: arguments[0];

		for (key in args) {
			str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
		}
	}

	return str;
};

// object to keep track of all TaskList instances.
// this permits us to get and alter a TaskList outside of the context of initial creation.
var TaskListManager = new Object ({
	taskLists: [],

	addList: function (taskList) {
		var i = this.getListIndex(taskList.id);

		if (i == null)
			this.taskLists.push(taskList);
		else
			this.taskLists[i] = taskList;
	},

	getList: function (id) {
		var i = this.getListIndex(id);

		if (i == null)
			return null;
		else
			return this.taskLists[i];
	},

	getListIndex: function (id) {
		for (var i = 0; i < this.taskLists.length; i++) {
		  if (this.taskLists[i].id == id)
			return i;
		}

		return null;
	}
});

// TaskList constructor
function TaskList (id)
{
	if (id)
	{
		var self = this;
		self.id = id;
		self.container = document.getElementById(self.id);
		self.taskData = [];

		// add the new TaskList object to the manager
		TaskListManager.addList(self);

		return self;
	}
	else
	{
		alert('Initialize the TaskList by providing the id of the target <div>.');
	}
}

// TaskList prototype functions
TaskList.prototype = {
	// iterate thru tasks to produce html content needed for presentation in targeted div
	bind: function (taskData) {
		var self = this;
		self.container.innerHTML = '';
		self.taskData = [];

		if (taskData.length == 0)
			self.container.innerHTML = "<div class='no-items'>No items to display</div>";
		else
			for (var i = 0; i < taskData.length; i++) {
				var obj = JSON.parse(JSON.stringify(taskData[i]));
				self.taskData.push(obj);

				var state, defaultStatus;
				var displayCompleteBtn = true;
				var displayDeleteBtn = true;
				
				switch(obj.state)
				{
					case 0:
						state = "active";
						defaultStatus = "Incomplete";
						break;
					case 1:
						state = "complete";
						defaultStatus = "Completed";
						displayCompleteBtn = false;
						break;
					case 2:
						state = "overdue";
						defaultStatus = "Overdue";
						break;
					default:
						state = "unknown";
						defaultStatus = "Status unknown";
						break;
				}
				
				var deleteAction = "javascript: TaskListManager.getList('" + self.id + "').delete(" + i + ");";
				var completeAction = "javascript: TaskListManager.getList('" + self.id + "').complete(" + i + ");";
				self.container.innerHTML += self.template().replaceTokens(
					state, 
					(obj.status == null ? defaultStatus : obj.status), 
					(obj.title == null ? 'Undefined' : obj.title), 
					(obj.body == null ? '' : obj.body), 
					(displayCompleteBtn ? '' : ' hidden'), 
					completeAction, 
					deleteAction
				);
			}
	},
	
	// change task state per args
	changeState: function (i, state) {
		if (state == 1) {
			var date = new Date();
			var options = {
				year: "numeric", month: "short",
				day: "numeric", hour: "2-digit", minute: "2-digit"
			};

			var dateTime = date.toLocaleTimeString("en-us", options);
			this.taskData[i]["status"] = "Completed " + dateTime;
		}

		this.taskData[i]["state"] = state;
		this.bind(this.taskData);
	},

	// change task state to completed
	complete: function (i) {
		this.changeState(i, 1);
	},

	// remove task from list
	delete:	function (i) {
		this.taskData.splice(i, 1);
		this.bind(this.taskData);
	},
	
	// change task state to escalated/overdue
	escalate: function (i) {
		this.changeState(i, 2);
	},
	
	// defines html content responsible for UI rendering
	template: function () {
		var htmlTemplate = '';
			htmlTemplate += '<div class=\'task {0}\'>';
			htmlTemplate += '  <h5>{1}</h5>';
			htmlTemplate += '  <div class=\'detail\'><h4>{2}</h4><p>{3}</p></div>';
			htmlTemplate += '  <div class=\'actions\'><span class=\'checkmark{4}\' onclick="{5}" title=\'Complete\'><div class=\'stem\'></div><div class=\'kick\'></div></span><span class=\'deletemark\' onclick="{6}" title=\'Delete\'><div class=\'stem\'></div><div class=\'kick\'></div></span></div>';
			htmlTemplate += '</div>';

		return htmlTemplate;
	},	
};