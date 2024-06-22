const url = "../json/credientals.json";


document.getElementById("loginForm").addEventListener('submit', function(event){

    

    const userName = document.getElementById("userName").value;
    const userPassword = document.getElementById("userPassword").value;
    console.log("Username ", userName)
    console.log("Password ", userPassword)
    

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const user = data.find(user => user.username === userName && user.password === userPassword);

            if (user){
                alert("successful")
                console.log("successful")
                
                window.location.href ="/pages/cms.html"
            
            } else{
                alert("User does not exist")
              
            }
        })
        .catch(error => {
            console.log("Error: ", error)
        })
           
});

console.log("hello world?xd")