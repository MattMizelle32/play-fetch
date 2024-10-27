onst output = document.getElementById("output");

document.getElementById("get-btn").addEventListener("click", async () => {
    // This function should send a GET request to the echo endpoint and output the result
    // The two input fields should be included in the request URL as **query parameters**
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    console.log(name);
    console.log(age);
    let response = await fetch(`https://echo.zuplo.io/api?name=${name}&age=${age}`);
    console.log(response);


    const data = await response.json();     //wait for the response and make it a json
    console.log("data", data);

    // make it a string to output
    const stringData = JSON.stringify(data, null, 2); // null and 2 are for formatting
    console.log("stringData", stringData);

    //output the string
    output.textContent = stringData; // set the output box to the response string


});

document.getElementById("post-json-btn").addEventListener("click", async () => {
    // This function should send a POST request to the echo endpoint with the input data as JSON
    // The two input fields should be included in the request body as **JSON data**

    // TODO
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    console.log(name);
    console.log(age);

    let response = await fetch(`https://echo.zuplo.io/api`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({q: name, page: age }),
    });

    const data = await response.json();
    console.log("data", data);

    const stringData = JSON.stringify(data, null, 2);
    console.log("stringData", stringData);

    output.textContent = stringData;

});

document.getElementById("post-form-btn").addEventListener("click", async () => {
    // This function should send a POST request to the echo endpoint with the input data as form data
    // The two input fields should be included in the request body as **url-encoded data**

    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    console.log(name);
    console.log(age);

    let response = await fetch(`https://echo.zuplo.io/api`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({q: name, page: age }),
    });

    const data = await response.json();
    console.log("data", data);

    const stringData = JSON.stringify(data, null, 2);
    console.log("stringData", stringData);

    output.textContent = stringData;

});

