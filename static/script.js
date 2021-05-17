//Import funkcji zajmującej się konwertowaniem znaków na emoji.
import { checkText } from 'https://cdn.skypack.dev/smile2emoji'


//Fragmenty interfejsu.
const input = document.getElementById("message")
const sendButton = document.getElementById("send")
const messageBox = document.getElementById("messageBox")
let $scrollbar = $("#scrollbar1")
$scrollbar.tinyscrollbar()
let $scrollbarData = $scrollbar.data("plugin_tinyscrollbar");


//Inicjowanie zmiennych z danymi o użytkowniku.
let userName = prompt("Podaj swój nick")
if(userName=="" || userName==undefined || userName==null){
    userName = "użytkownik"+Math.floor(Math.random()*1000)
}
// let userName = "Bob"
let commandType = false
let userColor = "#" + String(Math.floor(Math.random()*16777215).toString(16));
let blockedUsers = []
let lastMessage = ""


//Longpoll
var poll = function () {
    $.ajax({
    url: "http://localhost:3000/poll",
    success: async function(data){
        if(!blockedUsers.includes(data.nick)){
            let newMessage = document.createElement("div")

            let messageNick = document.createElement("span")
            messageNick.style.color = data.color
            messageNick.innerText = `[${data.nick}]`
    
            let messageText = document.createElement("span")
            let messageTextArray = data.message.split("/")
            // console.log(messageTextArray)
            if(messageTextArray[0] === "https:"){
                if(messageTextArray[2] === "www.youtube.com"){
                    // console.log(messageTextArray[0], messageTextArray[1], messageTextArray[2], messageTextArray[3].slice(8))
                    messageText.innerHTML = `<iframe class="youtubeLink" src="${messageTextArray[0]}//${messageTextArray[1]}/www.youtube.com/embed/${messageTextArray[3].slice(8)}?autoplay=1" title="YouTube video player" frameborder="0" allow="autoplay"></iframe>`
                }
                else if(messageTextArray[2] === "youtu.be"){
                    // console.log(messageTextArray[0], messageTextArray[1], messageTextArray[2], messageTextArray[3].slice(8))
                    messageText.innerHTML = `<iframe class="youtubeLink" src="${messageTextArray[0]}//${messageTextArray[1]}/www.youtube.com/embed/${messageTextArray[3]}?autoplay=1" title="YouTube video player" frameborder="0" allow="autoplay"></iframe>`
                }
                else{
                    messageText.innerText =": "+ data.message
                    messageText.classList.add("normalMessage")
                }
            }
            else{
                messageText.innerText =":        "+ data.message
                messageText.classList.add("normalMessage")
            }
            
    
            newMessage.appendChild(messageNick)
            newMessage.appendChild(messageText)
            messageBox.appendChild(newMessage)
            $('.normalMessage').emoticonize()
            
            // messageBox.scrollTop = messageBox.scrollHeight
            $scrollbarData.update("bottom");
        }
        
        poll();
    },
    error: function() {
        poll();
    },
    timeout: 30000
    });
};
poll();


//Event Listenery.
//Eventy całego okna.
window.addEventListener("keydown", function(event){
    input.focus()
    if(event.key === "Backspace" && input.value==="" && commandType === true){
        event.preventDefault()
        input.value="-"
        commandType=false
        inputChecking()
    }
})

//Eventy buttona SEND.
sendButton.addEventListener("mouseover", function(){
    sendButton.style.backgroundColor="rgb(221, 220, 220)"
})
sendButton.addEventListener("mouseout", function(){
    sendButton.style.backgroundColor="grey"
})
sendButton.addEventListener("click", sendMessage)

//Eventy inputa z wiadomością.
input.addEventListener("input", inputChecking)
input.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage()
    }
});


//Funkcja wysyłająca wiadomość
async function sendMessage(){
    var message = input.value
    if(message != "" && message!=null && message!=undefined){
        if(commandType){
            textFunctionsHandler(message)
        }
        else{
            if(message.toLowerCase() != lastMessage){
                lastMessage = message.toLowerCase()
                return new Promise((resolve, reject) => {
                    const http = new XMLHttpRequest();
                    var url = 'http://localhost:3000/grzyb';
                    var params = `nick=${userName}&message=${encodeURIComponent(message)}&color=${userColor}`
                    http.open('POST', url, true);
                    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    commandType = false
                    input.value = ""
                    http.onload = () => resolve(http.responseText);
                    http.onerror = () => reject(http.statusText);
                    http.send(params);
                  });
                
            }
        }
    }
    commandType = false
    input.value = ""
}


//Funkcja odpowiedzialna za odczytywanie i wykonywanie odpowiedniej funkcji w komunikatorze
function textFunctionsHandler(textFunction){
    let newMessage = document.createElement("div")
    textFunction = textFunction.split(" ")
    switch (textFunction[0].toLowerCase()) {
        case "sus":
            newMessage.innerText="AMOGUS";
            break;

        case "nick": case "nickname": case "username": case "user":
            textFunction.shift();
            userName = textFunction.join(" ");
            newMessage.innerText=`Nazwa użytkownika została zmieniona na ${userName}`;
            break;

        case "block":
            textFunction.shift();
            let blockedUser = textFunction.join(" ");
            newMessage.innerText=`Zablokowano użytkownika ${blockedUser}`;
            blockedUsers.push(blockedUser)
            break;

        case "unblock":
            textFunction.shift();
            let unblockedUser = textFunction.join(" ");
            if(blockedUsers.includes(unblockedUser)){
                newMessage.innerText=`Odblokowano użytkownika ${unblockedUser}`;
                blockedUsers.splice(blockedUsers.findIndex(user => user == unblockedUser), 1)
            }
            else{
                newMessage.innerText=`Nie znaleziono użytkownika ${unblockedUser}`;
            }
            break;
        
        case "color":
            userColor = textFunction[1]
            newMessage.innerHTML=`Kolor użytkownika został zmieniony na `;
            let colorSpan = document.createElement("span")
            colorSpan.style.color = userColor
            colorSpan.innerText=userColor
            newMessage.appendChild(colorSpan)
            colorSpan.addEventListener('click', function () {
                input.focus()
                input.value = `--color ${colorSpan.innerText}`
                inputChecking()
            })
            break;
        
        case "cls": case "erase": case "blank": case "clear":
            messageBox.innerText="";
            break;

        case "grappa":
            newMessage.innerHTML='<iframe class="youtubeLink" src="https://www.youtube.com/embed/JfssYhqj7gw?autoplay=1" title="YouTube video player" frameborder="0" allow="autoplay"></iframe>'
            // console.log(newMessage.firstChild)
            break

        case "player":
            newMessage.innerHTML='<iframe id="player" src="http://localhost:8080/" title="YouTube video player" frameborder="0" allow="autoplay"></iframe>'
            // console.log(newMessage.firstChild)
            break
        
        case "chat":
            newMessage.innerHTML='<iframe id="chat" src="http://localhost:3000/" title="YouTube video player" frameborder="0"></iframe>'
            // console.log(newMessage.firstChild)
            break

        case "dareks":
            newMessage.innerHTML='<iframe id="dareks" src="https://spec.pl.hostingasp.pl/Login.aspx?ReturnUrl=%2f" title="YouTube video player" frameborder="0"></iframe>'
            // console.log(newMessage.firstChild)
            break;
        
        default:
            newMessage.innerText=`Funkcja ${textFunction[0]} nie istnieje.`
            break

    }
    
    messageBox.appendChild(newMessage)
    $scrollbarData.update("bottom");
    // messageBox.scrollTop = messageBox.scrollHeight
}




async function inputChecking(){


    // if(input.value[0]!="-" || input.value[1]!="-"){
    //     input.style.fontStyle = "normal";
    //     input.value = checkText(input.value)
    //     commandType = false
    // }
    // else if(input.value[0]=="-" && input.value[1]=="-"){
    //     input.style.fontStyle = "italic";
    //     commandType = true
    // }
    if(input.value[0]=="-" && input.value[1]=="-"){
        commandType = true
        input.value=""
        input.classList.remove("text")
        input.classList.add("function")
    }
    else if(commandType==false){
        input.classList.remove("function")
        input.classList.add("text")
        // console.log($('#message'))
        // input.value = checkText(input.value)
    }
}




