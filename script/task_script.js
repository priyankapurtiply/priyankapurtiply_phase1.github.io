function displayForm(taskType) {
    ADD_LOADER.style.display = 'block';
    Header1.innerHTML = taskType;
    TaskDescription.value = "";
    TaskDueDate.value = "";
    TaskStatus.value ="" ;
    AddUpdateButton.onclick = function () {
        updateTask(0);
    }
}

function callbackJsonIFSI(requestData, requestType) {
    var request = new XMLHttpRequest();
    request.open('POST', "https://www.fsi.illinois.edu/demo/data.cfm");
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function() {
        if(request.status >= 200 && request.status < 400) 
        {
            //success
            var responseData;
            if(requestType == "AddTask")
            {
                responseData = JSON.parse(request.responseText);
                var addNewTask = [{ 
                    task_description : TaskDescription.value,
                    due_date : TaskDueDate.value, 
                    completed : TaskStatus.value, 
                    task_id : responseData["task_id"] 
                }];
                
                updateTasksToHTMLTable(addNewTask);
            }
            else if(requestType == "UpdateTask")
            {
                document.getElementById("lbl_task_description_" + requestData["task_id"].toString()).textContent = TaskDescription.value;
                var date = new Date(TaskDueDate.value);
                document.getElementById("lbl_due_date_"+requestData["task_id"].toString()).textContent = TaskDueDate.value;
                
                document.getElementById("lbl_completed_"+requestData["task_id"].toString()).textContent = TaskStatus.value;
            }
            else if(requestType == "DeleteTask")
            {
                var table = document.getElementById("TasksListTable");
                var tableRow = document.getElementById("TableRow_" + requestData["task_id"].toString());
                table.deleteRow(tableRow.rowIndex);
            }
            else //getAllTasks
            {
                responseData = JSON.parse(request.responseText);
                updateTasksToHTMLTable(responseData);
            }
        }
        else
        {
            alert("error");  
        }
    };
    
    request.onerror = function () {
        alert("connection error");
    };
    
    request.send(JSON.stringify(requestData));
}

function getTasks()
{
    var requestData = { action: "getTasks", apiKey: "906fb0b13df5d4a8c2af20a87381368e"};
    
    callbackJsonIFSI(requestData, "getTasks");
}

function updateTask(taskID)
{
    if(taskID == 0)
        {
            var addTaskDetail = {
                action: "createTask", 
                task_description: TaskDescription.value,
                due_date: TaskDueDate.value, 
                completed : TaskStatus.value, 
                apiKey :  "906fb0b13df5d4a8c2af20a87381368e"
            };
            callbackJsonIFSI(addTaskDetail, "AddTask");
        }
    else
    {
        var editTaskDetail = {
            action: "updateTask", 
            task_description: TaskDescription.value, 
            due_date : TaskDueDate.value, 
            completed : TaskStatus.value, 
            task_id : taskID, 
            apiKey :  "906fb0b13df5d4a8c2af20a87381368e"
        };
        callbackJsonIFSI(editTaskDetail, "UpdateTask");
    }
    ADD_LOADER.style.display = 'none';
}

function deleteTask(taskID) {
    var deleteTask = {
        action : "deleteTask", 
        task_id : taskID, 
        apiKey :  "906fb0b13df5d4a8c2af20a87381368e"
    };
    callbackJsonIFSI(deleteTask, "DeleteTask");
}

function editTask(task_id){
        displayForm('Edit Task');
        
        TaskDescription.value = document.getElementById("lbl_task_description_"+task_id.toString()).textContent;
        var date = new Date(document.getElementById("lbl_due_date_"+task_id.toString()).textContent);    
        TaskDueDate.valueAsDate = date;
        TaskStatus.value = document.getElementById("lbl_completed_"+task_id.toString()).textContent ;
        
        AddUpdateButton.onclick = function () {
           updateTask(task_id);
        };
		
        
        
    }

function updateTasksToHTMLTable(TasksList)
{
    var col = [];
    for (var i = 0; i < TasksList.length; i++)
    {
        for (var key in TasksList[i])
        {
            if (col.indexOf(key) === -1)
            {
                col.push(key);
            }
        }
    }
    
    // CREATE DYNAMIC TABLE.
    var table = document.getElementById("TasksListTable");
    
    // ADD DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < TasksList.length; i++)
    {
        var tr = table.insertRow(-1);
        var taskID;
        tr.id = "TableRow_"+TasksList[i]["task_id"];
        
        
        
      /*  for (var j = 0; j < col.length; j++)
        {
            var tabCell = tr.insertCell(-1);
            if(col[j] == "task_id"|| col[j] == "task_description"|| col[j] == "due_date"|| col[j] == "completed" )
            {
                tabCell.innerHTML = "<label id ='lbl_"+ col[j]+"_"+TasksList[i]["task_id"]+"'>"
                        +TasksList[i][col[j]] + "</label>";
            }
            else
                tr.deleteCell(-1);
        }*/
        
        var tabCell = tr.insertCell(-1);            
        tabCell.innerHTML = "<label id ='lbl_task_description_"+TasksList[i]["task_id"]+"'>"
        +TasksList[i]["task_description"] + "</label>";

        tabCell = tr.insertCell(-1);
        tabCell.innerHTML = "<label id ='lbl_due_date_"+TasksList[i]["task_id"]+"'>"
        +TasksList[i]["due_date"] + "</label>";
        
        tabCell = tr.insertCell(-1);
        tabCell.innerHTML = "<label id ='lbl_task_id_"+TasksList[i]["task_id"]+"'>"
        +TasksList[i]["task_id"] + "</label>";

        tabCell = tr.insertCell(-1);
        tabCell.innerHTML = "<label id ='lbl_completed_"+TasksList[i]["task_id"]+"'>"
        +TasksList[i]["completed"] + "</label>";

        
        tabCell = tr.insertCell(-1);
        tabCell.innerHTML = "&nbsp;&nbsp;<input type='button' value='Edit' onclick='editTask("+ TasksList[i]["task_id"]+");' /> &nbsp;&nbsp;&nbsp;" + "<input type='button' value='Delete' onclick='deleteTask("+ TasksList[i]["task_id"]+");' />";
    }
}