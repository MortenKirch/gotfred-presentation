

const kontaktOs = document.getElementById("kontakt-send");

const kontaktForm = document.getElementById("kontakt-form");

const Backbtn = document.createElement("button")

const kontaktBtn = document.getElementById("kontaktos")
kontaktBtn.onclick = function(){

    const indsendt = document.createElement("h3");
    indsendt.textContent = ("Vi har modtaget din besked, du vil få et svar hurtigts muligt");
    kontaktOs.appendChild(indsendt);
    kontaktOs.removeChild(kontaktForm)

    Backbtn.setAttribute("id", "kontaktos");
    Backbtn.textContent = ("TILBAGE")
    kontaktOs.appendChild(Backbtn)

    Backbtn.onclick = function(){
        kontaktOs.appendChild(kontaktForm)
        kontaktOs.removeChild(indsendt)
        kontaktOs.removeChild(Backbtn)
    
    }
    
}


