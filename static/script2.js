import { checkText } from 'https://cdn.skypack.dev/smile2emoji'

let userName = prompt("Podaj nazwę")
// let userName = "Bob"
let commandType = false
let userColor = "#" + String(Math.floor(Math.random()*16777215).toString(16));
let blockedUsers = []
const input = document.getElementById("message")
const sendButton = document.getElementById("send")
const messageBox = document.getElementById("messageBox")


sendButton.addEventListener("mouseover", function(){
    sendButton.style.backgroundColor="rgb(221, 220, 220)"
})
sendButton.addEventListener("mouseout", function(){
    sendButton.style.backgroundColor="grey"
})

window.addEventListener("keypress", function(){
    input.focus()
})

async function sendMessage(){
    var message = input.value
    if(message != "" && message!=null && message!=undefined){
        if(commandType){
            let newMessage = document.createElement("div")
            message = message.slice(2).split(" ")
            switch (message[0].toLowerCase()) {
                case "sus":
                    newMessage.innerText="AMOGUS";
                    break;

                case "nick": case "nickname": case "username": case "user":
                    message.shift();
                    userName = message.join(" ");
                    newMessage.innerText=`Nazwa użytkownika została zmieniona na ${userName}`;
                    break;

                case "block":
                    message.shift();
                    let blockedUser = message.join(" ");
                    newMessage.innerText=`Zablokowano użytkownika ${blockedUser}`;
                    blockedUsers.push(blockedUser)
                    break;

                case "unblock":
                    message.shift();
                    let unblockedUser = message.join(" ");
                    if(blockedUsers.includes(unblockedUser)){
                        newMessage.innerText=`Odblokowano użytkownika ${unblockedUser}`;
                        blockedUsers.splice(blockedUsers.findIndex(user => user == unblockedUser), 1)
                    }
                    else{
                        newMessage.innerText=`Nie znaleziono użytkownika ${unblockedUser}`;
                    }
                    break;
                
                case "color":
                    userColor = message[1]
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
                    newMessage.innerHTML='<iframe id="grappa" src="https://www.youtube.com/embed/JfssYhqj7gw?autoplay=1" title="YouTube video player" frameborder="0" allow="autoplay"></iframe>'
                    console.log(newMessage.firstChild)
                    break

                case "player":
                    newMessage.innerHTML='<iframe id="player" src="http://localhost:8080/" title="YouTube video player" frameborder="0" allow="autoplay"></iframe>'
                    console.log(newMessage.firstChild)
                    break
                
                case "chat":
                    newMessage.innerHTML='<iframe id="chat" src="http://localhost:3000/" title="YouTube video player" frameborder="0"></iframe>'
                    console.log(newMessage.firstChild)
                    break

                case "dareks":
                    newMessage.innerHTML='<iframe id="dareks" src="https://spec.pl.hostingasp.pl/Login.aspx?ReturnUrl=%2f" title="YouTube video player" frameborder="0"></iframe>'
                    console.log(newMessage.firstChild)
                    break
                
                default:
                    newMessage.innerText=`Funkcja ${message[0]} nie istnieje.`
                    break

            }
            
            messageBox.appendChild(newMessage)
        }
        else{
            var http = new XMLHttpRequest();
            var url = 'http://localhost:3000/grzyb';
            
            var params = `nick=${userName}&message=${encodeURIComponent(message)}&color=${userColor}`
        
            http.open('POST', url, true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.send(params);
        }
    }

    input.value = ""
    messageBox.scrollTop = messageBox.scrollHeight
}

async function inputChecking(){

    
    if(input.value[0]!="-" || input.value[1]!="-" || input.value[2]=="-"){
        input.style.fontStyle = "normal";
        input.value = checkText(input.value)
        commandType = false
    }
    else if(input.value[0]=="-" && input.value[1]=="-"){
        input.style.fontStyle = "italic";
        commandType = true
    }
}

sendButton.addEventListener("click", sendMessage)


input.addEventListener("input", inputChecking)
input.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage()
    }
});

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
            messageText.innerText =": "+ data.message
    
            newMessage.appendChild(messageNick)
            newMessage.appendChild(messageText)
            messageBox.appendChild(newMessage)
            messageBox.scrollTop = messageBox.scrollHeight
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