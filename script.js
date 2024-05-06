
const inputBox = document.getElementById('inputBox');
const listContainer = document.getElementById('listContainer');
let token='';

const todoApi = "http://localhost:8000/api/todo/";
const loginApi ="http://localhost:8000/api/user/login";

async function getTodoList(){
    try{
        const res = await fetch(todoApi, {
            method: "GET",
            headers: {
                "Authorization" : "Bearer " + token
            }
        });
        const todoList = await res.json();
        todoList.forEach((todo) => {
            const listElement = document.createElement('li');
            console.log(todo._id);
            console.log(todo); 
            listElement.setAttribute('id', todo._id);
            listElement.innerHTML = `
                ${todo.todo}  &nbsp; &nbsp;
                <span class="fa fa-pencil"  onclick ="updateTask('${todo._id}','${todo.todo}')"> &nbsp; &nbsp; </span> 
                <span class="fa fa-trash-o" onclick ="deleteTask('${todo._id}')"> </span>
            `
            listContainer.appendChild(listElement);
        });
    }
    catch(err){
        console.log("Error : ", err.message);
    }
}

// getTodoList();

async function addTask(){

    if(inputBox.value === ''){
        alert("You must write something!");
    }

    else{
        const listElement = document.createElement('li');
        try{
            const res = await fetch(todoApi, {
            method: "POST",
            body: JSON.stringify({
              value: inputBox.value
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization" : "Bearer " + token
            }
            });
            const todo = await res.json();
            console.log(todo._id);
            console.log(todo); 
            listElement.setAttribute('id', todo._id);
            // listElement.innerHTML = `
            //     ${todo.todo}  &nbsp; &nbsp;
            //     <span>
            //         <span class="fa fa-pencil"  onclick =" (e) => { "updateTask('${todo._id}','${todo.todo}')"} "> &nbsp; &nbsp; </span> 
            //         <span class="fa fa-trash-o" onclick ="deleteTask('${todo._id}')"> </span>
            //     </span>
            // `



            listElement.innerHTML = `${todo.todo}  &nbsp; &nbsp;`
            const spanContainer = document.createElement('span');
            const spanChild1 = document.createElement('span');
            spanChild1.innerHTML = "&nbsp; &nbsp;"
            spanChild1.setAttribute('class','fa fa-pencil');
            const spanChild2 = document.createElement('span');
            spanChild2.setAttribute('class','fa fa-trash-o');
            spanContainer.appendChild(spanChild1);
            spanContainer.appendChild(spanChild2);
            listElement.appendChild(spanContainer);
            listContainer.appendChild(listElement);

            spanChild1.onclick = (e) => {
                updateTask(todo._id,todo.todo);
            }
        }

        catch(err){
            console.log(err.message);
        }
    }
    
} 

async function updateTask(id,value){
    try{
            console.log("I'm inside updateTask function");
            const listElement = document.getElementById(id);  
            const spanElement = document.createElement('span');
            const updateBox = document.createElement('input');
            updateBox.setAttribute('type','text');
            updateBox.setAttribute('id','updateBox');
            updateBox.setAttribute('placeholder',value);
            
            const updatebtn = document.createElement('button');
            updatebtn.innerHTML = "Done";
            updatebtn.onclick = (e) => {
                console.log(updateBox.value);
                update(id,updateBox.value);
            }
            const removebtn = document.createElement('span');
            removebtn.setAttribute('class','fa fa-trash-o');
            removebtn.onclick = (e) => {
                console.log('Removing updateBox');
                removeElement('updateBox');
            }
            
            spanElement.setAttribute('id','updateBox');
            spanElement.appendChild(updateBox);
            spanElement.appendChild(updatebtn);
            spanElement.appendChild(removebtn);
            
            listElement.appendChild(spanElement);   
    }

    catch(err){
        console.log(err.message);
    }
    
}

async function update(id,value){
    console.log("i'm inside update function");
    console.log(id," ",value);

    try{
        if(value === '') {
            console.log("No update");
            return;
        }
        const updateApi = todoApi + id;
        console.log("calling update api", updateApi);
        const listElement = document.getElementById(id);  
        const res = await fetch(updateApi, {
            method: "PUT",
            body: JSON.stringify({
              value: value
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization" : "Bearer " + token
            }
        });
        const todo = await res.json();
        console.log("Updated todo : ", todo);
        listElement.innerHTML = `
                ${todo.todo}  &nbsp; &nbsp;
                <span class="fa fa-pencil"  onclick ="updateTask('${todo._id}','${todo.todo}')"> &nbsp; &nbsp; </span> 
                <span class="fa fa-trash-o" onclick ="deleteTask('${todo._id}')"> </span>
        `

    }
    catch(err){
        console.log(err.message);
    }
}


async function deleteTask(id){
    try{
        const deleteApi = todoApi + id;
        console.log(deleteApi);
        const res = await fetch(deleteApi, {
            method: "DELETE",
            headers: {
                "Authorization" : "Bearer " + token
            }
        });
        const deletedTodo = await res.json();
        console.log("Deleted todo", deletedTodo);
        document.getElementById(id).remove();
    }
    catch(err){
        console.log(err.message);
    }
}

function removeElement(id){
    console.log("Id of element : " , id);
    document.getElementById(id).remove();
}

async function login(){
    console.log("I'm inside loginform");
    const formContainer = document.getElementById('formContainer');

    formContainer.innerHTML = formContainer.innerHTML + 
    `<form id="loginForm">
        <label for="email">Email id:</label>
        <input type="text" id="email" name="email"><br>
        <label for="password">Password:</label>
        <input type="text" id="password" name="password"><br>
        <button type="submit">Submit</button>
    </form>`

    let loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        let email = document.getElementById("email");
        let password = document.getElementById("password");

        if (email.value == "" || password.value == "") {
            alert("Ensure you input a value in both fields!");
        } 
        else {
        // perform operation with form input
            alert("This form has been successfully submitted!");
            console.log(
            `This form has a email of ${email.value} and password of ${password.value}`
            );

            await callLoginApi(email.value,password.value);  

            email.value = "";
            password.value = "";
            loginForm.innerHTML ="";
        }
    });

}

async function callLoginApi(email,password){
    try{
        const res = await fetch(loginApi, {
            method: "POST",
            body: JSON.stringify({
              email: email,
              password:password
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
        });
        console.log(res);
        const result = await res.json(); 
        console.log(result);
        if(res.status === 400){
            alert(result.message)
        }
        else{
            alert("Login successful");
            token = result.accessToken;
            console.log(token); 
            getTodoList();
        }
    }
    catch(err){
        console.log(err.message);
    }
}