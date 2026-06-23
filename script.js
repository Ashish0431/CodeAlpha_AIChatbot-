const API_KEY = "AQ.Ab8RN61G2yIx8TnzywHfRtdZI_ykFbX29M8CG3N8YllunKJMIA";

const chatBox =
document.getElementById("chatBox");

const userInput =
document.getElementById("userInput");

const sendBtn =
document.getElementById("sendBtn");

const clearBtn =
document.getElementById("clearBtn");

function addMessage(text,type){

    const div =
    document.createElement("div");

    div.classList.add(
        "message",
        type
    );

    div.innerText = text;

    chatBox.appendChild(div);

    chatBox.scrollTop =
    chatBox.scrollHeight;
}

async function sendMessage(){

    const message =
    userInput.value.trim();

    if(!message) return;

    addMessage(message,"user");

    userInput.value = "";

    const typing =
    document.createElement("div");

    typing.className =
    "typing";

    typing.id =
    "typing";

    typing.innerText =
    "AI is typing...";

    chatBox.appendChild(typing);

    try{

        const response =
        await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                contents:[

                    {
                        role:"user",

                        parts:[
                            {
                                text:message
                            }
                        ]
                    }

                ]

            })
        });

        const data =
        await response.json();

        document
        .getElementById("typing")
        ?.remove();

        if(data.error){

            addMessage(
                data.error.message,
                "bot"
            );

            return;
        }

        const reply =
        data?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text ||
        "No response.";

        addMessage(
            reply,
            "bot"
        );

    }
    catch(error){

        document
        .getElementById("typing")
        ?.remove();

        addMessage(
            "Connection Error",
            "bot"
        );

        console.error(error);
    }
}

sendBtn.addEventListener(
"click",
sendMessage
);

userInput.addEventListener(
"keypress",
function(e){

    if(e.key==="Enter"){
        sendMessage();
    }
}
);

clearBtn.addEventListener(
"click",
()=>{
    chatBox.innerHTML="";
}
);
