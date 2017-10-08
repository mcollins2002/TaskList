## Task List

TaskList is a responsive library that accepts JSON input to output an interactive item list.

Author: [Matthew Collins]

## Installation

1. Download the latest library files to your project: [js/tasklist.js], [css/tasklist.css]
2. Add the .js and .css references to your html:

```html
  <!-- TaskList css -->
  <link rel="stylesheet" href="css/tasklist.css">

  <!-- TaskList js -->
  <script type="text/javascript" src="js/tasklist.js"></script>
```

3. Define a ```<div>``` to serve as the TaskList container.
4. Initialize a new TaskList by specifying the ```<div>``` id.
5. Bind your JSON data to the TaskList.

## Code Example

```html
<html>
	<head>
		<title>TaskList Library Example</title>
		<script type="text/javascript" src="js/tasklist.js"></script>
		<link rel="stylesheet" href="css/tasklist.css">
	</head>
	<body>
		<div id="grocery-list"></div>
	</body>
</html>

<script type="text/javascript">
	// bind groceries JSON to new tasklist instance
	var groceries = [
		{"title":"Eggs", "body": "1 dozen large eggs.", "state":0 },
		{"title":"Apples", "body": "Fuji or Honeycrisp.", "state":1, "status":"Completed Oct 7, 2017, 8:33 AM" },
		{"title":"Milk", "body": "Whole milk and almond milk.", "state":0 }
	];

	var groceryList = new TaskList('grocery-list'); //instantiate tasklist by specifying the target div id
	groceryList.bind(groceries); // bind data to list
</script>
```