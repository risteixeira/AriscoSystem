/* Arisco Project - Website
 * 
 * Author: Ana Rita Teixeira
 *
 * */
//Saves the responses of the quiz
var jsonResponses = {};
var evalDoctors = {};
/*Tracks of the trees*/
var suicideTreeTrack = [];
var violenceTreeTrack = [];
var escapeTreeTrack = [];
var autoAgressTreeTrack = [];
//Saves the results of the trees
var suicideResult;
var autoagressResult;
var violenceResult;
var escapeResult;
var patiologicResult;
//counter of theme
var agressCounter=0;
var suicideCounter = 0;
var heteroagressCounter = 0;
var escapeCounter = 0;

//Questions to display.
var questionToDisplay = [];
var dataReceived;

//aux to subquestions to Display
var majorQuestion = "";
var questionSub = [];
var lasEvaluation;

//adress of the server
var serverAddress = "http://rita.eu-4.evennode.com/"
//var serverAddress = "http://localhost:3000/";

var alterRespShow = false;
var lastEvalSearch = false;
/*#######################################################################################
 * ######################################################################################
 * ##############          SYSTEM FUNCTIONS OF INIT.HTML              ###################
 * ######################################################################################
 * ######################################################################################
 * */

//*
//*
//Reset to all variables and HTML created
function initPge(){
	var res = document.cookie;
    var multiple = res.split(";");
    for(var i = 0; i < multiple.length; i++) {
    	var key = multiple[i].split("=");
        document.cookie = key[0]+" =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
    }
    jsonResponses = {};
    evalDoctors = {};
    agressCounter=0;
    suicideCounter = 0;
    heteroagressCounter = 0;
    escapeCounter = 0;
    questionToDisplay = [];
    dataReceived;
    majorQuestion = "";
    questionSub = [];
    lasEvaluation;

    var myNode = document.getElementById("questionsSec2");
    var myNode1 = document.getElementById("questionsSec1");
    while (myNode != undefined &&  myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);}
    while (myNode1 != undefined &&  myNode1.firstChild) {
        myNode1.removeChild(myNode1.firstChild);}
}
//*
//*
//Find if patient exists to decide what questions to show
function findPatientId(){
    initPge();
    //Check if patientId is ok
    if(document.getElementById("PatientId").value == ""){
        alert("ALERTA: Código de identificação do utente inexistente.");
    }
    else if(isNaN(document.getElementById("PatientId").value)){
        alert("ALERTA: Código de identificação do utente apenas pode conter digitos.");
    }
    else{ //patient ID is ok ...
        document.getElementById("loagergiff").style.display = "inherit";
        var auxSend = {};
        auxSend["patId"] =  document.getElementById("PatientId").value;
        var toSend = JSON.stringify(auxSend);
        var xhr = new XMLHttpRequest();
        //connection to server ...
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                dataReceived = JSON.parse(this.responseText);
                if(dataReceived[ Object.keys(dataReceived).length-1].fixedQuest){ //todas as perguntas
                    for (i = 0; i < Object.keys(dataReceived).length-1; i++) {
                            if (dataReceived[i].subQuestion.data[0] == 1) { // is a sub-question
                                questionToDisplay[i] = dataReceived[i].description;
                                createHTMLWithSubQuestions(questionToDisplay[i], dataReceived[i+1].description, dataReceived[i].questOrder,dataReceived[i].sectionId);
                            }else {
                                questionToDisplay[i] = dataReceived[i].description;
                                createHTML(dataReceived[i].questOrder, questionToDisplay[i],dataReceived[i].sectionId);
                            } 
                    }
                    
                }
                else{ //mostrar apenas perguntas com section = 2 (perguntas que mudam)
                    document.getElementById("questionsSec2").style.display = "none";
                    for (i = 0; i < Object.keys(dataReceived).length-1; i++) {
                        if(dataReceived[i].sectionId == 2){ // so as perguntas que mudam
                            if (dataReceived[i].subQuestion.data[0] == 1) { // is a sub-question
                                questionToDisplay[i] = dataReceived[i].description;
                                createHTMLWithSubQuestions(questionToDisplay[i], dataReceived[i+1].description, dataReceived[i].questOrder,dataReceived[i].sectionId);
                            }else {
                                questionToDisplay[i] = dataReceived[i].description;
                                createHTML(dataReceived[i].questOrder, questionToDisplay[i],dataReceived[i].sectionId);
                            } 
                        }
                    }
                }
                document.getElementById("loagergiff").style.display = "none";
                document.getElementById("questionnaire").style.display = "inherit"; 
            }
        } //end received from server ...
        xhr.open("POST",serverAddress + 'findId' , true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(toSend); 
    }
}
//*
//*
//Creates HTML to questions that have subquestions.
function createHTMLWithSubQuestions(questionToDisplay, questionToDisplayAfter, number,idSec) {
    if (questionToDisplay != undefined && questionToDisplayAfter != undefined && number != undefined) {
        var separated = questionToDisplay.split(':');
        majorQuestion = separated[0];
        questionSub.push({ 'ques': separated[1], 'number': number });

        if (questionToDisplayAfter.split(':') != undefined && questionToDisplayAfter.split(':')[0] != majorQuestion) {
            var toAdd;
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
                divSep.appendChild(addBottunsHTML(elementName));
                divSub.appendChild(divSep);
            }
            questionSub = [];
            majorQuestion = "";
            node.appendChild(divSub);
           // console.log(questionsSec1);
            if(idSec == 1){
                document.getElementById("questionsSec2").appendChild(node);
            }else{
                document.getElementById("questionsSec1").appendChild(node);
            }
        }
    }
}
//*
//Function to create HTML for single questions.
function createHTML(number, textToDisplay,idSec) {
    if (number != undefined && textToDisplay != undefined) {
        var elementName = 'Quest_' + number.toString();
        var questionNumber = 'Quest_' + number.toString();
        var node = document.createElement("div");
        node.id = "s_quest";
        var paragrph = document.createElement("p1");
        paragrph.id = elementName;
        paragrph.innerText = textToDisplay;
        node.appendChild(paragrph);
        //checkBoxes
        var toAdd = addBottunsHTML(questionNumber);
        node.appendChild(toAdd);
        if(idSec == 1){
            document.getElementById("questionsSec2").appendChild(node);
        }else{
            document.getElementById("questionsSec1").appendChild(node);
        }
    }
}
//*
//Function to add Yes and No radio buttons
function addBottunsHTML(buttonName) {
    var boxesDiv = document.createElement("div");
    boxesDiv.id = "checkboxes";
    var questionNumber = "Button_"+buttonName;
    var radioInputYes = document.createElement('input');
    radioInputYes.type = 'radio';
    radioInputYes.id = questionNumber;
    radioInputYes.name = questionNumber;
    radioInputYes.onclick = function () {
        checkBoxes(questionNumber);
    };
    var text = document.createElement("p");
    text.textContent = "Sim";
    text.id = "checkParagraphs";
    boxesDiv.appendChild(text);
    boxesDiv.appendChild(radioInputYes);
    var radioInputNo = document.createElement('input');
    radioInputNo.type = 'radio';
    radioInputNo.id = questionNumber;
    radioInputNo.name = questionNumber;
    radioInputNo.onclick = function () {
        checkBoxes(questionNumber);
    };
    var text = document.createElement("p");
    text.textContent = "Não";
    text.id = "checkParagraphs";
    boxesDiv.appendChild(text);
    boxesDiv.appendChild(radioInputNo);
    return boxesDiv;
}

/*--------------------------------------------------------------------------------------------*/

function checkBoxes(id) {
    var newId = id.replace(/Button_/g,'');
    jsonResponses[newId] = document.getElementById(id).checked;
}

function newcheckBoxes(id){ //for doctor evaluation
    if(document.getElementById(id).checked){
        evalDoctors[id] = "Muito Alto";
    }else{
        evalDoctors[id] = "nao Muito Alto";
    }
}

function getResponse(question) {
    if (question != undefined && question.indexOf("suicideCount") !== -1) {
        var aux = question.split('_');
        if (suicideCounter >= parseInt(aux[1]))
            return true;
        else {
            return false;
        }
    }else if( question != undefined && question.indexOf("agressCount") !== -1) {
        var aux = question.split('_');
        if (agressCounter >= parseInt(aux[1]))
            return true;
        else {
            return false;
        }

    }else if( question != undefined && question.indexOf("escapeCount") !== -1) {
        var aux = question.split('_');
        if (escapeCounter >= parseInt(aux[1]))
            return true;
        else {
            return false;
        }
    }
    
    else {
        return jsonResponses[question];
    }
}

function calculateRisk(tree, track) {
    if (tree.FinalNode) {
        track.push(tree.id);
        track.push(tree.response);
        return track;
    }else {
        response = getResponse(tree.question);
        track.push(tree.question);
        if (response) {
            return calculateRisk(tree.responseYes, track);
        }
        else {
            return calculateRisk(tree.responseNo,track);
        }
    }
}


//Calculate trees counters
function calculateCounters() {
    for (i = 0; i < Object.keys(jsonResponses).length-1; i++) {
        elementName = "Quest_" + (i + 1).toString();
        if (jsonResponses[elementName] && dataReceived[i].category.indexOf("suicidio") != -1 ) {
            suicideCounter++;
        }else if (jsonResponses[elementName] && dataReceived[i].category.indexOf("autoagress") != -1) {
            agressCounter++;
        }else if (jsonResponses[elementName] && dataReceived[i].category.indexOf("fuga") != -1) {
            heteroagressCounter++;
        }else if (jsonResponses[elementName]  && dataReceived[i].category.indexOf("Heretoagress") != -1) {
            escapeCounter++;
        }
    }
}

function calculatePatalogicResult(){
    for (i = 0; i < dataReceived.length-1; i++) {
        var elementName = "Quest_" + (i+1).toString();
        if( dataReceived[i].category.indexOf("Patologia") != -1){
            if(jsonResponses[elementName]){
                return "Muito Alto";}
        }
    }
    return "nao Muito Alto";
}

function sendToServer() {
    var patient = document.getElementById("PatientId").value;
    jsonResponses["patientId"] = patient;
    jsonResponses["suicideDoctor"] = evalDoctors.suicide_risk_doctor;
    jsonResponses["agressDoctor"] = evalDoctors.autoagress_risk_doctor;
    jsonResponses["heteroDoctor"] = evalDoctors.violence_risk_doctor;
    jsonResponses["escapeDoctor"] = evalDoctors.escape_risk_doctor;
    jsonResponses["patologicDoctor"] = evalDoctors.patolog_risk_doctor;
    jsonResponses["suicideTree"] = suicideResult;
    jsonResponses["agressTree"] = autoagressResult;
    jsonResponses["heteroTree"] = violenceResult;
    jsonResponses["escapeTree"] = escapeResult;
    jsonResponses["patalogicTree"] = patiologicResult;

    var toSend = JSON.stringify(jsonResponses);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("loagergiff").style.display = "inherit";
            document.getElementById("questionnaire").style.display = "none";
            window.location.href = 'resultPage.html'+ '#' + document.getElementById("PatientId").value;
        }
    }
    xhr.open("POST",serverAddress + 'end' , true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(toSend);
}

function getMissingResponses(){
    var auxSend = {};
    auxSend["patId"] =  document.getElementById("PatientId").value;
    var toSend = JSON.stringify(auxSend);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            lasEvaluation = JSON.parse(this.responseText);
           for(i = 0; i < Object.keys(lasEvaluation).length; i++){
                var aux = "Quest_" + lasEvaluation[i].questionId.toString();
                if(jsonResponses[aux] == undefined){ //quest nao existe nas respostas
                    if(lasEvaluation[i].response.data[0] == 1)
                        jsonResponses[aux] = true;
                    else{
                        jsonResponses[aux] = false;
                    }
                }
            }
            calculateCounters();
            calculateRisks();
            sendToServer();
        }
    }
    xhr.open("POST",serverAddress + 'missingQuest' , true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(toSend); 
}

function calculateRisks(){
        //Caluclate Suicide Tree
        suicideTreeTrack = calculateRisk(suicideTree, []);
        suicideResult = suicideTreeTrack[suicideTreeTrack.length - 1];
        //Calculate Autoagressive Tree
        autoAgressTreeTrack = calculateRisk(autoAgressTree, []);
        autoagressResult = autoAgressTreeTrack[autoAgressTreeTrack.length - 1];
        //Calculating Violence Risk
        violenceTreeTrack = calculateRisk(ViolenceTree, []);
        violenceResult = violenceTreeTrack[violenceTreeTrack.length - 1];
        //Calculating Escape Risk
        escapeTreeTrack = calculateRisk(EscapeTree, []);
        escapeResult = escapeTreeTrack[escapeTreeTrack.length - 1];
        patiologicResult = calculatePatalogicResult();
}

function post() {
    if (Object.keys(jsonResponses).length < 20 && dataReceived.fixedQuest) {
        alert("ALERTA: Para avançar é necessário responder a todas as perguntas.");
    } else if (Object.keys(jsonResponses).length < 13 && !dataReceived.fixedQuest) {
        alert("ALERTA: Para avançar é necessário responder a todas as perguntas.");
    }else if(document.getElementById("PatientId").value == ""){
        alert("ALERTA: Código de identificação do utente inexistente.");
    }else if(isNaN(document.getElementById("PatientId").value)){
        alert("ALERTA: Código de identificação do utente apenas pode conter digitos.");
    }else if(Object.keys(evalDoctors).length < 5){
        alert("ALERTA: Para avançar é necessário responder a todos os níveis de risco.");
    }else{
        getMissingResponses();
    }
}

function showOptions(){
    if(document.getElementById("PatientId").value == ""){
        alert("ALERTA: Código de identificação do utente inexistente.");
    }
    else if(isNaN(document.getElementById("PatientId").value)){
        alert("ALERTA: Código de identificação do utente apenas pode conter digitos.");
    }else{
        if(!alterRespShow){
            document.getElementById("QuestOptions").style.display = "inherit";
            alterRespShow = true;}
        else{
            document.getElementById("QuestOptions").style.display = "none";
            alterRespShow = false;
        }
    }
 }

 function alterResponse() {
    if(document.getElementById("PatientId").value == ""){
        alert("ALERTA: Código de identificação do utente inexistente.");
    }
    else if(isNaN(document.getElementById("PatientId").value)){
        alert("ALERTA: Código de identificação do utente apenas pode conter digitos.");
    }else{
        document.getElementById("QuestOptions").style.display = "none";
        alterRespShow = false; 

        var e = document.getElementById("questionShow").value;
        var e1 = document.getElementById("resposChoose").value;
        var auxSend = {};
        auxSend["patId"] =  document.getElementById("PatientId").value;
        auxSend["questionToChange"] = e;
        auxSend["responseToChange"] = e1;
        var toSend = JSON.stringify(auxSend);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                }
        }
        xhr.open("POST",serverAddress + 'changeResponse' , true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(toSend);  
    }
 }

 function showLastEvals(){
    if(document.getElementById("PatientId").value == ""){
        alert("ALERTA: Código de identificação do utente inexistente.");
    }
    else if(isNaN(document.getElementById("PatientId").value)){
        alert("ALERTA: Código de identificação do utente apenas pode conter digitos.");
    }else{
        if(!lastEvalSearch){
            findDataToDisplay();
        }
        else{
            document.getElementById("lastEvalSec").style.display = "none";
            lastEvalSearch = false;
        }
    }
 }

 function closeEvals(){
    document.getElementById("lastEvalSec").style.display = "none";
    lastEvalSearch = false; 

 }

 function findDataToDisplay(){
    var xhr = new XMLHttpRequest();
    var toSend = JSON.stringify({"patId":document.getElementById("PatientId").value});
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            received = JSON.parse(this.responseText);
            console.log(received);

            if(received.length == 0){
                document.getElementById("displayEval1").innerHTML = "Utente não tem avaliações."
            }
            else if(received.length == 1){
                var date = received[received.length-1].evaluationDate.replace(/[^\d.-:-]/g, ' ');
                date = date.split('.');
                document.getElementById("displayEval1").innerHTML ="- " + date[0];
            }
            else{
                var date = received[received.length-1].evaluationDate.replace(/[^\d.-:-]/g, ' ');
                date = date.split('.');
                var date1 = received[received.length-2].evaluationDate.replace(/[^\d.-:-]/g, ' ');
                date1 = date1.split('.');
                document.getElementById("displayEval1").innerHTML = "- " + date[0];     
                document.getElementById("displayEval2").innerHTML = "- " + date1[0];             
            }
            document.getElementById("lastEvalSec").style.display = "inherit";
            lastEvalSearch = true;

        }
    }
    xhr.open("POST",serverAddress + 'getLastEvals' , true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(toSend);  

 }