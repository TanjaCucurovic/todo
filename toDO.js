var config = {
  apiKey: "AIzaSyDIctJny2odYR_9jtVCXR1eTIWNKG12oZY",
  authDomain: "my-todos-b1256.firebaseapp.com",
  databaseURL: "https://my-todos-b1256.firebaseio.com",
  projectId: "my-todos-b1256",
  storageBucket: "my-todos-b1256.appspot.com",
  messagingSenderId: "941052208113"
};
firebase.initializeApp(config);

var myFirebase = firebase.database().ref();
var todosFB = myFirebase.child("todos");

var todoList = {
  todos: [],
  addTodo: function (todoText, todoDate) {
    this.todos.push({
      todoText: todoText,
      todoDate: todoDate,
      completed: false
    });

    /** Poslati na firebase 
     * {
        "completed" : true,
        "date" : "2019-03-03",
        "text" : "kupiti hleb"
      }
     * 
    */

    todosFB.push({
      "date": todoDate,
      "text": todoText,
      "completed": false
    });


  },
  
  changeTodo: function (position, todoDate, todoText) {
    firebase.database().ref().child('todos/'+ position).set({
      "date": todoDate,
      "text": todoText
    });
  },
  deleteTodo: function (position) {
    var todoToDelete = firebase.database().ref().child('todos/'+ position);
    todoToDelete.remove();
  },
  toggleCompleted: function (position) {
  firebase.database().ref('/todos/' + position).once('value').then(function(snapshot) {
    var completed = snapshot.val().completed;
    var todoText = snapshot.val().text;
    var todoDate = snapshot.val().date;
    completed = !completed; 
    firebase.database().ref().child('todos/' + position).set({
      "date" : todoDate,
      "text" : todoText,
      "completed": completed
    });
  });

  },
  toggleAll: function () {
    var userDataRef = firebase.database().ref("todos").orderByKey();
    userDataRef.once("value").then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var key = childSnapshot.key;
        firebase.database().ref('/todos/' + key).once('value').then(function(snapshot) {

          var todoText = snapshot.val().text;
          var todoDate = snapshot.val().date;

          firebase.database().ref().child('todos/' + key).set({
            "date" : todoDate,
            "text" : todoText,
            "completed": true
          });
        });
      })
    }); 
    view.displayTodos();
  }
 
};

var handlers = {
  addTodo: function () {
    var addTodoTextInput = document.getElementById('addTodoTextInput');
    var addTodoDateInput = document.getElementById('addTodoDateInput');
    if (addTodoTextInput.value != "") {
      todoList.addTodo(addTodoTextInput.value, addTodoDateInput.value);
      addTodoTextInput.value = "";
      view.displayTodos();
    }
  },
  changeTodo: function () {

    var changeTodoPositionInput = document.getElementById('changeTodoPositionInput').value;
    var changeTodoDateInput = document.getElementById('changeTodoDateInput');
    var changeTodoTextInput = document.getElementById('changeTodoTextInput');
    todoList.changeTodo(changeTodoPositionInput, changeTodoDateInput.value, changeTodoTextInput.value);
    changeTodoPositionInput.value = '';
    changeTodoDateInput.value = '';
    changeTodoTextInput.value = '';
    document.getElementById('change-input-group').classList.remove('change-input-group-visible');
    document.getElementById('change-input-group').classList.add('change-input-group-hidden');
    view.displayTodos();
  },
  changeTodoItem: function (id, date, text) {
    document.getElementById('changeTodoPositionInput').value = id;
    document.getElementById('changeTodoDateInput').value = date;
    document.getElementById('changeTodoTextInput').value = text;
  },
  deleteTodo: function (position) {
    todoList.deleteTodo(position);
    view.displayTodos();
  },
  toggleCompleted: function (id) {
    var toggleCompletedPositionInput = id;
    todoList.toggleCompleted(toggleCompletedPositionInput);
    view.displayTodos();
  },
  toggleAll: function () {
    todoList.toggleAll();
    
  }
};

var view = {
  displayTodos: function () {
    if (todoList.todos.length === 0) {
      document.getElementById('todo-panel').classList.remove('todo-panel-visible');
      document.getElementById('todo-panel').classList.add('todo-panel-hidden');
    } else {
      document.getElementById('todo-panel').classList.remove('todo-panel-hidden');
      document.getElementById('todo-panel').classList.add('todo-panel-visible');
    }
    //kako izslistati podateke iz farebase i kako ih prikazati
    // Attach an asynchronous callback to read the data at our posts reference
    
    var todosUl = document.getElementById('list-group');
      todosUl.innerHTML = '';

    var userDataRef = firebase.database().ref("todos").orderByKey();
    userDataRef.once("value").then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        var todoLi = document.createElement('li');
        var status = document.createElement("span");
        var todoDate = document.createElement("span");
        var todoTextWithCompletion = document.createElement('span');
        todoTextWithCompletion.className = "todo-content";
        todoDate.className = "todo-date";
        todoDate.innerHTML = childData.date;
        todoTextWithCompletion.innerHTML = childData.text;
        if (childData.completed == true) {
          status.innerHTML = '<i class="fa fa-check-square-o" aria-hidden="true"></i>';
        } else {
          status.innerHTML = '<i class="fa fa-square-o" aria-hidden="true"></i>';
        }
        todoLi.id = key;
        todoLi.appendChild(status);
        todoLi.appendChild(todoDate);
        todoLi.appendChild(todoTextWithCompletion);
        var todoBtns = document.createElement("span");
        todoLi.todoText = todoTextWithCompletion.innerHTML;
        todoBtns.className = "todo-buttons";
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'deleteButton btn btn-danger';
 
        var changeButton = document.createElement('button');
        changeButton.textContent = 'Change';
        changeButton.className = 'changeButton btn btn-success';
        var toggleButton = document.createElement('button');
        toggleButton.textContent = "Toggle";
        toggleButton.className = "toggleButton btn btn-secundary";
        todoBtns.appendChild(deleteButton);
        todoBtns.appendChild(changeButton);
        todoBtns.appendChild(toggleButton);
        todoLi.appendChild(todoBtns);
        todosUl.appendChild(todoLi);
      })
    })
  },
  createDeleteButton: function () {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteButton btn btn-danger';
    return deleteButton;
  },
  createChangeButton: function () {
    var changeButton = document.createElement('button');
    changeButton.textContent = 'Change';
    changeButton.className = 'changeButton btn btn-success';
    return changeButton;
  },
  createToggleButton: function () {
    var toggleButton = document.createElement('button');
    toggleButton.textContent = "Toggle";
    toggleButton.className = "toggleButton btn btn-secundary";
    return toggleButton;
  },
  setUpEventListeners: function () {
    var todosUl = document.getElementById('list-group');
    todosUl.addEventListener('click', function (event) {
      var elementClicked = event.target;
      if (elementClicked.className === 'deleteButton btn btn-danger') {
        // <li id="Laq.......">
        handlers.deleteTodo(elementClicked.parentNode.parentNode.id);

      } else if (elementClicked.className === 'changeButton btn btn-success') {
        document.getElementById('change-input-group').classList.remove('change-input-group-hidden');
        document.getElementById('change-input-group').classList.add('change-input-group-visible');
        var parent = elementClicked.parentNode.parentNode;
        var childNodes = parent.childNodes;
        var id = parent.id;
        var todoDate = childNodes[1].innerHTML;
        var todoText = childNodes[2].innerHTML;
        handlers.changeTodoItem(id, todoDate, todoText);
      } else if (elementClicked.className === 'toggleButton btn btn-secundary') {
        handlers.toggleCompleted(elementClicked.parentNode.parentNode.id);
      }

    })
  }


};

view.setUpEventListeners();

function toggle_visibility(id) {
  var e = document.getElementById('foo');
  document.getElementById('todo-button-hide').classList.add('hidden');
  if (e.style.display == 'block')
    e.style.display = 'none';
  else
    e.style.display = 'block';
}
/* ------------------------------------------------------------------------------------------------------------------------------------------------ */


window.onload = function () {

  const hourHand = document.querySelector('.hourHand');
  const minuteHand = document.querySelector('.minuteHand');
  const secondHand = document.querySelector('.secondHand');
  const time = document.querySelector('.time');
  const clock = document.querySelector('.clock');

  function setDate() {
    const today = new Date();

    const second = today.getSeconds();
    const secondDeg = ((second / 60) * 360) + 360;
    secondHand.style.transform = `rotate(${secondDeg}deg)`;



    const minute = today.getMinutes();
    const minuteDeg = ((minute / 60) * 360);
    minuteHand.style.transform = `rotate(${minuteDeg}deg)`;

    const hour = today.getHours();
    const hourDeg = ((hour / 12) * 360);
    hourHand.style.transform = `rotate(${hourDeg}deg)`;

    time.innerHTML = '<span>' + '<strong>' + hour + '</strong>' + ' : ' + minute + ' : ' + '<small>' + second + '</small>' + '</span>';

  }

  setInterval(setDate, 1000);

}
// Get the modal LogIn
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
// Get the modal SignUp
var modal = document.getElementById('signUp');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}