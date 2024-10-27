onst userList = document.getElementById("user-list");

document.addEventListener("DOMContentLoaded", async () => {
    // This function should GET the first page of users from reqres.in.
    // The users should be displayed in the user-list element.
    // Each user should be in a new <div> with the user's first name, last name, and profile image.
    // The format should follow the example user in the HTML file.

    // TODO
    const page = 1;
    let response = await fetch(`https://reqres.in/api/users?page=${page}`);
    console.log(response);

    const data = await response.json();
    console.log("data", data);

    // loop through the data and create a div for each user
    data.data.forEach(user => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `<h2>${user.first_name} ${user.last_name}</h2>
        <img src="${user.avatar}" alt="${user.first_name} ${user.last_name}"></img>`;
        userList.appendChild(div);
    });
});

