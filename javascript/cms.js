const url = "../json/kager3.json";


document.getElementById("kageForm").addEventListener('submit', function(event){

    event.preventDefault();
  
    const navn = document.getElementById("navn");
    const myfile = document.getElementById("myfile");
    const beskrivelse = document.getElementById("beskrivelse");

    
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            

            const nyKage = {
                "navn" : navn,
                "billede" : myfile,
                "beskrivelse" : beskrivelse,
                "ikoner" : []
            };

            data.kager.push(nyKage)

            const name = document.body = addElement

            function addElement() {
                const kageDiv = document.createElement("div");
                const newCake = document.createTextNode(data);

                kageDiv.appendChild(newCake);

                const nyKageProdukt = document.getElementById("nyKageProdukt");
                document.body.insertBefore(newCake, kageDiv);

            }

            console.log(data)



            document.getElementById("kageForm").reset();

            console.log("Den nye kage er belvet tilføjet")
        })
        .catch(error => {
            console.log("Error: ", error)
        })
           
});