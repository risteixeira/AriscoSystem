/* Arisco Project - Website
 * 
 * Author: Ana Rita Teixeira
 *
 * */
//Global variables init
var suicideResult = "";
var agressResult = "";
var violenceResult = "";
var escapeResult = "";
var patalogicResult = "";
var suicideTrack = "";
var agressTrack = "";
var violenceTrack = "";
var escapeTrack = "";
var SuicideDoctor = "";
var agessDoctor = "";
var violenceDoctor = "";
var escapeDoctor = "";
var patalogicDoctor = "";
var responsesQuest = [];
var userId;
var questionSub = [];
//****************** */
//adress of the server
var serverAddress = "http://rita.eu-4.evennode.com/"
//var serverAddress = "http://localhost:3000/";

function initPage() {
    userId = window.location.hash.substring(1);
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    newdate = day +"/" + month + "/" + year;
    document.getElementById("pacientID").innerHTML = "ID do paciente: " + userId;
    document.getElementById("evaluationDate").innerHTML = newdate;

    var xhr = new XMLHttpRequest();
    var questionToDisplay=[];
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            dataReceived = JSON.parse(this.responseText);
            for (i = 0; i < Object.keys(dataReceived).length; i++) {
                if (dataReceived[i].subQuestion.data[0] == 1) { // is a sub-question
                     questionToDisplay.push(dataReceived[i].description);
                    createHTMLWithSubQuestions(questionToDisplay[i], dataReceived[i+1].description, dataReceived[i].questOrder,dataReceived[i].sectionId);
                }else {
                    questionToDisplay.push(dataReceived[i].description);
                    createHTML(dataReceived[i].questOrder, questionToDisplay[i],dataReceived[i].sectionId);
                } 
            }
            getValuesToDisplay(userId);
        }
    }
    xhr.open("GET",serverAddress + 'lastPage' , true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var toSend = {};
    xhr.send(toSend);
}

function getValuesToDisplay(id){
    var xhr = new XMLHttpRequest();
    var toSend = JSON.stringify({"patId":id});
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            responsesQuest = JSON.parse(this.responseText);
            var textToWrite = "";
            for( i = 0; i< responsesQuest.length ; i++){
                var aux = responsesQuest[i].response.data[0];
                if(aux =="1") {
                    textToWrite = "Sim";
                }else{
                    textToWrite = "Não";
                }
                document.getElementById("asw_" + "Quest_" + (i+1).toString()).innerHTML= textToWrite;
                document.getElementById("asw_" + "Quest_" + (i+1).toString()).style.display= "contents";
            }
        getEvalLevelsToDisplay(userId);
        }
    }
    xhr.open("POST",serverAddress + 'infoLastPage' , true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(toSend);  
}

function getEvalLevelsToDisplay(id){
    var xhr = new XMLHttpRequest();
    var toSend = JSON.stringify({"patId":id});
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var evallevels = JSON.parse(this.responseText);
            SuicideDoctor = evallevels[0].medicEvalSuicide;
            agessDoctor = evallevels[0].medicEvalAutoagress;
            violenceDoctor = evallevels[0].medicEvalHeteroagress;
            escapeDoctor = evallevels[0].medicEvalEscape;
            patalogicDoctor = evallevels[0].medicEvalPatology;
            treatAccents();
            calculateRisksColors();
            document.getElementById("loagergiff").style.display = "none";
            document.getElementById("infoSpace").style.display = "inherit";
        }
    }
    xhr.open("POST",serverAddress + 'evalLastLevels' , true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(toSend); 

}

function treatAccents() {
    if (SuicideDoctor.indexOf("nao") !== -1) {
        SuicideDoctor = " não Muito Alto";}
    if (agessDoctor.indexOf("nao") !== -1) {
        agessDoctor = " não Muito Alto";}
    if (violenceDoctor.indexOf("nao") !== -1) {
        violenceDoctor = " não Muito Alto";}
    if (escapeDoctor.indexOf("nao") !== -1) {
        escapeDoctor = " não Muito Alto";}
    if(patalogicDoctor.indexOf("nao") !== -1){
        patalogicDoctor = "não Muito Alto"}
}


function calculateRisksColors() {
    document.getElementById("suicideResult_doctor").innerHTML = SuicideDoctor;
    if (SuicideDoctor == "Muito Alto") {
        //red
        document.getElementById("suicideResult_doctor").style.color = "#E45656";
    } else {
        //green
        document.getElementById("suicideResult_doctor").style.color = "#62BA62";}

    document.getElementById("agressResult_doctor").innerHTML = agessDoctor;
    if (agessDoctor == "Muito Alto") {
        //red
        document.getElementById("agressResult_doctor").style.color = "#E45656";
    } else {
        //green
        document.getElementById("agressResult_doctor").style.color = "#62BA62";}

    document.getElementById("violenceResult_doctor").innerHTML = violenceDoctor;
    if (violenceDoctor == "Muito Alto") {
        //red
        document.getElementById("violenceResult_doctor").style.color = "#E45656";
    } else {
        //green
        document.getElementById("violenceResult_doctor").style.color = "#62BA62";}

    document.getElementById("escapeResult_doctor").innerHTML = escapeDoctor;
    if (escapeDoctor == "Muito Alto") {
        //red
        document.getElementById("escapeResult_doctor").style.color = "#E45656";
    } else {
        //green
        document.getElementById("escapeResult_doctor").style.color = "#62BA62";}
    document.getElementById("patologResult_doctor").innerHTML = patalogicDoctor;
    if (patalogicDoctor == "Muito Alto") {
        //red
        document.getElementById("patologResult_doctor").style.color = "#E45656";
    } else {
        //green
        document.getElementById("patologResult_doctor").style.color = "#62BA62";}
}

//Creates HTML to questions that have subquestions.
function createHTMLWithSubQuestions(questionToDisplay, questionToDisplayAfter, number,idSec) {
    if (questionToDisplay != undefined && questionToDisplayAfter != undefined && number != undefined) {
        var separated = questionToDisplay.split(':');
        majorQuestion = separated[0];
        questionSub.push({ 'ques': separated[1], 'number': number });

        if (questionToDisplayAfter.split(':') != undefined && questionToDisplayAfter.split(':')[0] != majorQuestion) {
            var node = document.createElement("div");
            node.id = "s_quest";
            //major question paragraph
            var textnode = document.createElement("p1");
            textnode.innerText = majorQuestion;
            node.appendChild(textnode);

            var divSub = document.createElement("div");
            divSub.id = "subQuestion";

            for (j = 0; j < 2; j++) {
                divSep = document.createElement("div");
                divSep.id = "subQuestStyle";
                var paragrphToDisplay = document.createElement("p");
                elementName = 'Quest_' + questionSub[j].number.toString();
                paragrphToDisplay.id = elementName;
                paragrphToDisplay.innerText = questionSub[j].ques;
                divSep.appendChild(paragrphToDisplay);
                var nodeAswer = document.createElement("p");
                nodeAswer.id = "asw_" + elementName;
                nodeAswer.style.fontWeight = "bold";
                divSep.appendChild(nodeAswer);
                divSub.appendChild(divSep);
            }
            questionSub = [];
            majorQuestion = "";
            node.appendChild(divSub);
            
            document.getElementById("questions").appendChild(node);
        }
    }
}

//Function to create HTML for single questions.
function createHTML(number, textToDisplay,idSec) {
    if (number != undefined && textToDisplay != undefined) {
        var elementName = 'Quest_' + number.toString();
        var questionNumber = 'Quest_' + number.toString();

        var node = document.createElement("div");
        node.id = "s_quest";
        node.style.display= "flex";
        var paragrph = document.createElement("p1");
        paragrph.id = elementName;
        paragrph.innerText = textToDisplay;
        node.appendChild(paragrph);

        var nodeAswer = document.createElement("p");
        nodeAswer.id = nodeAswer.id = "asw_" + elementName;
        nodeAswer.style.fontWeight = "bold";
        node.appendChild(nodeAswer);
        //checkBoxes
        document.getElementById("questions").appendChild(node);
    }
}

