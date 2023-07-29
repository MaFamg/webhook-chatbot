const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express().use(body_parser.json());
const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;



app.listen(process.env.PORT, ()=>{
    console.log("webhook is listening!")
});


//to verify the callback from dashboard side - whatsapp API
app.get("/webhook", (req, res)=>{
    let mode = req.query["hub.mode"];
    let challenge = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];

    if(mode && token){
        
        if (mode =="subscribe" && token==mytoken){
            res.status(200).send(challenge);
        }
        else {
            res.status(403);
        
        }
    }
});

app.post("/webhook", (req, res)=>{

    let body_param = req.body;
    console.log(JSON.stringify(body_param), null, 2);

    if(body_param.object){
        console.log("INSIDE BODY PARAM");
        if(body_param.entry && body_param.entry[0].changes && body_param.entry[0].changes[0].value.messages && body_param.entry[0].changes[0].value.messages[0]){

            console.log("teste 1");
            console.log("teste 2");
            console.log("teste 3");

            let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

            axios({
                method:"POST",
                url:"https://graph.facebook.com/v17.0/"+phon_no_id+"/messages?access_token="+token,
                data:{
                    messaging_product:"whatsapp",
                    to:from,
                    text:{
                        body: "Hi, I am the chat bot alive" + msg_body  
                    }

                }, 
                headers:{
                    "Content-Type":"application/json"
                }
            });

            console.log("teste 4");
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    

    }

});

app.get("/", (req, res)=>{
    res.status(200).send("Hello this is webhook setup!");
});