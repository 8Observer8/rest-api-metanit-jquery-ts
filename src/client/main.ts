import $ from "jquery";

function getUsers()
{
    $.ajax({
        url: "/api/users",
        type: "GET",
        contentType: "application/json",
        success: function (users)
        {
            var rows = "";
            $.each(users, function (index, user)
            {
                // Add received element to table
                rows += row(user);
            })
            $("table tbody").append(rows);
        }
    });
}

function getUser(id)
{
    $.ajax({
        url: "/api/users/" + id,
        type: "GET",
        contentType: "application/json",
        success: function (user)
        {
            var form = document.forms["userForm"];
            form.elements["id"].value = user.id;
            form.elements["name"].value = user.name;
            form.elements["age"].value = user.age;
        }
    });
}

function createUser(userName, userAge)
{
    $.ajax({
        url: "api/users",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            name: userName,
            age: userAge
        }),
        success: function (user)
        {
            reset();
            $("table tbody").append(row(user));
        }
    })
}

function editUser(userId, userName, userAge)
{
    $.ajax({
        url: "api/users",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: userId,
            name: userName,
            age: userAge
        }),
        success: function (user)
        {
            reset();
            $("tr[data-rowid='" + user.id + "']").replaceWith(row(user));
        }
    })
}

// Reset a form
function reset()
{
    var form = document.forms["userForm"];
    form.reset();
    form.elements["id"].value = 0;
}

function deleteUser(id)
{
    $.ajax({
        url: "api/users/" + id,
        contentType: "application/json",
        method: "DELETE",
        success: function (user)
        {
            console.log(user);
            $("tr[data-rowid='" + user.id + "']").remove();
        }
    })
}

// Create a row of table
function row(user)
{
    return "<tr data-rowid='" + user.id + "'><td>" + user.id + "</td>" +
        "<td>" + user.name + "</td> <td>" + user.age + "</td>" +
        "<td><a class='editLink' data-id='" + user.id + "'>Edit</a> | " +
        "<a class='removeLink' data-id='" + user.id + "'>Delete</a></td></tr>";
}

// Reset values of form
$("#reset").on("click", function (e)
{
    e.preventDefault();
    reset();
})

// Send a form
$("form").on("submit", function (e)
{
    e.preventDefault();

    const id = parseInt($("#id").val() as string);
    const name = $("#name").val() as string;
    const age = $("#age").val() as string;

    if (id === 0)
    {
        createUser(name, age);
    }
    else
    {
        editUser(id, name, age);
    }
});

// Handler for Edit Button
$("body").on("click", ".editLink", function ()
{
    const id = $(this).data("id");
    getUser(id);
});

// Handler for Delete Button
$("body").on("click", ".removeLink", function ()
{
    const id = $(this).data("id");
    deleteUser(id);
});

$(() =>
{
    getUsers();
});
