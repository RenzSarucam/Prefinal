var express = require("express");
var app = express();
var fs = require("fs");

var employee = {
  employee9: {
    id: 9,
    companyName: "Omsimos Collective",
    employeeName: "Magi",
    position: "Front end Developer",
    location: "Panacan, Davao City",
  },

  employee10: {
    id: 10,
    companyName: "Cebu Computer Enthusiasts",
    employeeName: "Niko",
    position: "Network Specialist",
    loccation: "Toril, Davao City",
  },
};

// The addUser endpoint (POST)
app.post("/addUsers", function (req, res) {

  fs.readFile(__dirname + "/" + "server.json", "utf8", function (err, data) {
    data = JSON.parse(data);

    data.employee9 = employee.employee9;
    data.employee10 = employee.employee10;

    console.log(data);
    res.end(JSON.stringify(data));
  });
});

// The Endpoint to get List of Users (GET)
app.get("/getUsers", function (req, res) {
  fs.readFile(__dirname + "/" + "server.json", "utf8", function (err, data) {
    console.log(data);
    res.end(data);
  });
});

// The Endpoint to get a single user by id
app.get("/:id", function (req, res) {
  fs.readFile(__dirname + "/" + "server.json", "utf8", function (err, data) {
    var employees = JSON.parse(data);
    var employee = employees["employee" + req.params.id];
    if (employee) {
      console.log(employee);
      res.end(JSON.stringify(employee));
    } else {
      res.status(404).send();
    }
  });
});

// The Endpoint to get a single user by companyName
app.get("/companyName/:companyName", function (req, res) {
  const companyName = req.params.companyName.replace(/%20/g, " ");
  fs.readFile(__dirname + "/" + "server.json", "utf8", function (err, data) {
    var employees = JSON.parse(data);
    var matchingEmployees = Object.values(employees).filter(
      (employee) => employee.companyName === companyName
    );
    if (matchingEmployees.length > 0) {
      console.log(matchingEmployees);
      res.end(JSON.stringify(matchingEmployees));
    } else {
      res.status(404).send();
    }
  });
});

// THe Endpoint of updating specific users (PUT)
app.put("/updateUser/:id", function (req, res) {
  const id = req.params.id;
  const updatedInfo = req.body;

  fs.readFile(__dirname + "/" + "server.json", "utf8", function (err, data) {
    let users = JSON.parse(data);
    if (users["employee" + id]) {
      users["employee" + id] = { ...users["employee" + id], ...updatedInfo };
      fs.writeFile(
        __dirname + "/" + "server.json",
        JSON.stringify(users),
        function (err) {
          if (err) throw err;
          res.end(JSON.stringify(users["employee" + id]));
        }
      );
    } else {
      res.status(404).send();
    }
  });
});

// The Endpoint of deleting specific users (DELETE)
app.delete("/deleteUsers/:id", function (req, res) {
  const id = req.params.id;
  fs.readFile(__dirname + "/" + "server.json", "utf8", function (err, data) {
    let users = JSON.parse(data);
    if (users["employee" + id]) {
      delete users["employee" + id];
      fs.writeFile(
        __dirname + "/" + "server.json",
        JSON.stringify(users),
        function (err) {
          if (err) throw err;
          res.end(JSON.stringify(users));
        }
      );
    } else {
      res.status(404).send();
    }
  });
});

// Create a server to listen at port 3000
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("REST API demo app listening at http://%s:%s", host, port);
});