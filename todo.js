//   Run On Windows =>   .\todo.bat
// The app should read from and write to a `todo.txt` text file.
// When a todo item is completed, it should be removed from `todo.txt` and instead added to the `done.txt` text file.
const fs = require("fs");
const { exit } = require("process");

function usage() {
  let usage = `Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`;
  console.log(usage);
  exit();
}

function addItem(listItem) {
  if (!listItem) {
    let message = "Error: Missing todo string. Nothing added!";
    console.log(message);
  }
  fs.appendFile("todo.txt", `${listItem} \n`, function (err, file) {
    if (err) throw err;
    let message = `Added todo: \"${listItem}\"`;
    console.log(message);
  });
}

function listTodo() {
  try {
    let data = fs.readFileSync("todo.txt", "utf8");
    let dataArray = data.split("\n");
    dataArray.pop();
    let dataLenth = dataArray.length;
    let da = [];
    if (dataArray.length === 0) {
      console.log(`There are no pending todos!`);
      exit();
    }
    for (let i = dataLenth; i > 0; i--) {
      console.log(`[${i}] ${dataArray[i - 1]}\n`);
    }
    // da.forEach((item) => console.log(item));
    exit();
  } catch (e) {
    console.log("There are no pending todos!");
  }
}

function overwriteFile(dataArray) {
  fs.writeFile("todo.txt", `${dataArray[0]} \n`, function (err) {
    if (err) {
      console.log(err);
    }
  });
  for (let i = 1; i < dataArray.length; i++) {
    fs.appendFile("todo.txt", `${dataArray[i]} \n`, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
}

function delItem(listItemPosition) {
  if (!listItemPosition) {
    let message = "Error: Missing NUMBER for deleting todo.";
    console.log(message);
    exit();
  }
  try {
    let data = fs.readFileSync("todo.txt", "utf8");
    let dataArray = data.split("\n");
    dataArray.pop();
    // console.log(dataArray);
    let itemPosition = listItemPosition - 1;

    let dataLenth = dataArray.length;

    if (listItemPosition > dataArray.length || listItemPosition < 1) {
      console.log(
        `Error: todo #${listItemPosition} does not exist. Nothing deleted.`
      );
      exit();
    } else {
      dataArray.splice(itemPosition, 1);
      overwriteFile(dataArray);
      console.log(`Deleted todo #${listItemPosition}`);
    }
  } catch (e) {
    console.log("Delete Error");
  }
}

function doneItem(listItemPosition) {
  if (!listItemPosition) {
    let message = "Error: Missing NUMBER for marking todo as done.";
    console.log(message);
    exit();
  }

  try {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    let fullDate = `${year}-${month}-${day}`;

    let data = fs.readFileSync("todo.txt", "utf8");
    let dataArray = data.split("\n");
    dataArray.pop();
    let itemPosition = listItemPosition - 1;
    let deletedItem;
    if (listItemPosition > dataArray.length || listItemPosition < 1) {
      console.log(`Error: todo #${listItemPosition} does not exist.`);
      exit();
    } else {
      deletedItem = dataArray.splice(itemPosition, 1);

      overwriteFile(dataArray);
      fs.appendFile(
        "done.txt",
        `${listItemPosition} ${fullDate} ${deletedItem[0]} \n`,
        function (err, file) {
          if (err) throw err;
          let message = `Marked todo #${listItemPosition} as done.`;
          console.log(message);
        }
      );
    }
  } catch (e) {
    console.log("Done Error", e);
    exit();
  }
}

function reportTodo() {
  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let fullDate = `${year}-${month}-${day}`;
  let todoData = fs.readFileSync("todo.txt", "utf8");
  let todoArray = todoData.split("\n");
  todoArray.pop();
  let todoLength = todoArray.length;
  let doneData = fs.readFileSync("done.txt", "utf8");
  let doneArray = doneData.split("\n");
  doneArray.pop();
  let doneLength = doneArray.length;
  let report = `${fullDate} Pending : ${todoLength} Completed : ${doneLength}`;
  console.log(report);
  exit();
}

var arguments = process.argv;
if (arguments[2] == null) {
  usage();
} else if (arguments[2] === "help") {
  usage();
} else if (arguments[2] === "ls") {
  listTodo();
} else if (arguments[2] === "add") {
  addItem(arguments[3]);
} else if (arguments[2] === "del") {
  delItem(arguments[3]);
} else if (arguments[2] === "done") {
  doneItem(arguments[3]);
} else if (arguments[2] === "report") {
  reportTodo();
}
