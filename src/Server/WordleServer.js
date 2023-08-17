const express = require('express');
const mongoose = require('mongoose');
const app = new express();
const cors = require('cors');

//user middlewares to interpret json responses and activate cors
app.use(express.json());
app.use(cors()); //cors allows access to the server from different domains
//url to the cloud provider with credentials

const uri = "";//INSERT API KEY

// Connect to the server with mongoose
let correctWord = "";
mongoose.connect(uri).then(() =>{
    mongoose.connection.useDb("Wordle"); //Once connected switch to the correct database
    app.listen(3001, () => { //listen on port 3001
        console.log("Server is running at http://localhost:3001");
    });
})
    .catch(err => console.log("error while connecting to Mongo"));

/**
    Create the schema that will be used for all users
 */
const userSchema = new mongoose.Schema({
    userName: String,
    letters: Object,
    words: Object,
    guessCount: Object
});

const wordSchema = new mongoose.Schema({
    word: String,
    totalGuesses: Number,
    totalTimesAsCorrect: Number,
    totalGuessesUntilFound: Number,
    averageGuessesUntilFound: Number,
},{strict: "throw"});


//create a user model based on the given schema
const userModel = new mongoose.model("Users", userSchema);
const fiveLetterWordModel = new mongoose.model("fiveletterwords", wordSchema);
const sixLetterWordModel = new mongoose.model("sixletterwords", wordSchema);
const sevenLetterWordModel = new mongoose.model("sevenletterwords", wordSchema);
let currentModel;
let length = 5;
/**
 * Checks if a value is defined
 */
const isDefined = (value) => (
    value !== undefined && value !== null && typeof(value) !== 'undefined'
);

/**
 * Checks if value is defined, is a string, and has a length > 0
 */
const isNonEmptyString = (value) => (
    isDefined(value) && typeof(value) === "string" && value.length > 0
);

/**
 * Checks if a value is defined and is a number
 */
const isInteger = (value) => (
    isDefined(value) && !isNaN(value) && Number.isInteger(parseFloat(value))
);

async function getRandomWordAndSetModel(model, wordLength){
    let count = await model.count();
    const random = Math.floor(Math.random() * count);
    correctWord = await model.findOne().skip(random);
    await model.updateOne({word: `${correctWord.word}`}, {$inc : {totalTimesAsCorrect: 1}});
    currentModel = model;
    length = wordLength;
}

async function validateWord(UserWord){
    let found = await currentModel.findOne({word: `${UserWord.toLowerCase()}`});
    return UserWord.length === length && found !== null;
}

const handleValid = (word) => {
    let letters = [];
    let stringArray = Array.from(word);
    let letterCounts = new Map();
    let yellowIndexes = [];
    for(let c of word){
        if(!letterCounts.has(c)){
            letterCounts.set(c,0);
        }
    }
    for(let i = 0; i < stringArray.length; i++) {
        letters.push({letter: stringArray[i], color: "rgb(35,35,35)", used: false});
        for (let j = 0; j < correctWord.word.length; j++) {
            if (stringArray[i] === correctWord.word[j] && (j === i)) {
                letterCounts.set(stringArray[i], letterCounts.get(stringArray[i]) + 1);
                if (letters.at(i).color === "rgb(176,169,32)") {
                    yellowIndexes[i] = undefined;
                }
                letters.at(i).used = true;
                letters.at(i).color = "green";
                break;
            } else if (stringArray[i] === correctWord.word[j]) {
                if (letters.at(i).color !== "green" && letters.at(i).color !== "rgb(176,169,32)") {
                    const index = letters.findIndex(e => e.letter === stringArray[i] && e.used === false);
                    letters.at(index).color = "rgb(176,169,32)";
                    letters.at(index).used = true;
                    yellowIndexes[i] = {letter: stringArray[i], index: index};
                }
            }
        }
    }
    for(let c of yellowIndexes){
        if(c !== undefined){
            let letter = letterCounts.get(c.letter);
            if(!(letter < correctWord.word.match(new RegExp(c.letter, 'g')).length)){
                letters.at(c.index).color = "rgb(35,35,35)";
            }
            letterCounts.set(c.letter,letter + 1);
        }
    }
    return letters;
}

app.get("/getWord", async (request, response) => {
    response.json({
        status: "success",
        word: correctWord
    });
});

app.post("/setCorrectWord", async (request, response) => {
    if(!isNonEmptyString(request.query.length)){
        response.json({
            status: "error",
            message: "Length of query must be valid"
        });
        return;
    }
    try{
        if(parseInt(request.query.length) === 5){
            await getRandomWordAndSetModel(fiveLetterWordModel, 5);
        }else if(parseInt(request.query.length) === 6){
            await getRandomWordAndSetModel(sixLetterWordModel, 6);
        }else if(parseInt(request.query.length) === 7){
            await getRandomWordAndSetModel(sevenLetterWordModel, 7);
        }
        console.log(correctWord.word);
        response.json({
            message: `Word of length ${request.query.length} has been selected.`,
            word: correctWord
        });
    }catch(error){
        response.json({
            status: "error",
            message: `Database Error: ${error}`,
        });
    }
});

const addWord = (model, word) => {
    const newWord = new model({
        word: word,
        totalGuesses: 0,
        totalTimesAsCorrect: 0,
        totalGuessesUntilFound: 0,
        averageGuessesUntilFound: 0,
    });
    newWord.save();
}
app.patch("/addWord", async (request, response) => {
    if(!isNonEmptyString(request.query.word)){
        response.json({
            status: "error",
            message: "Word must be valid"
        });
        return;
    }
    try{
        if(request.query.word.length === 5){
            addWord(fiveLetterWordModel,request.query.word);
        }else if(request.query.word.length === 6){
            addWord(sixLetterWordModel, request.query.word);
        }else if(request.query.word.length === 7){
            addWord(sevenLetterWordModel, request.query.word);
        }
        response.json({
            message: `Word : ${request.query.word} has been added`,
            addedWord: request.query.word
        });
    }catch(error){
        response.json({
            status: "error",
            message: `Database Error: ${error}`,
        });
    }
});

app.get('/compareWords', async (request, response) => {
    if(!isNonEmptyString(request.query.word)){
        response.json({
            status: "error",
            message: "Given word must be a non empty string"
        });
        return;
    }
    if(await validateWord(request.query.word)){
        let changeLetters= handleValid(request.query.word);
        response.json({
            status: "success",
            changeLetters: changeLetters,
            currCorrect: correctWord,
            win: request.query.word.toLowerCase().normalize() === correctWord.word.toLowerCase().normalize()
        });
        return;
    }else{
        response.json({
            status: "error",
            message: "Word is invalid"
        });
    }
});

/**
 * addUser - POST API endpoint to create a new user on the server
 */
app.post("/addUser", async (request, response) => {
    //make sure the user is not already in the server
    if(await userModel.find({userName: request.query.name}).count() > 0) {
        response.json({
            status: "error",
            message: `The User already exists`,
        });
        return;
    }
    //make sure the username is valid
    if(!isNonEmptyString(request.query.name)){
        response.json({
            status: "error",
            message: "Username must be a non-empty string"
        });
        return;
    }
    try {
        //create a new user object
        const newUser = new userModel({
            userName: request.query.name,
            letters: {a:0, b:0, c:0, d:0, e:0, f:0, g:0, h:0, i:0, j:0, k:0, l:0, m:0, n:0, o:0, p:0, q:0, r:0, s:0, t:0, u:0, v:0, w:0, x:0, y:0, z:0},
            words: {},
            guessCount: {1:0, 2:0, 3:0, 4:0, 5:0, 6:0}
        });
        //save the user to the database
        await newUser.save();
        //respond to the request with a success status and the created user
        response.json({
            status: "success",
            user: newUser
        });
    } catch(error) {
        response.json({
            status: "error",
            message: `Database Error: ${error}`,
        });
    }
});
/**
 * userByName - GET API endpoint that handles getting users using given name
 */
app.get("/userByName", async (request, response) => {
    try {
        //make sure the username is not empty
        if(!isNonEmptyString(request.query.name)){
            response.json({
                status: "error",
                message: "userName must be specified",
            });
        }
        //find the user based on the name
        const user = await userModel.find({userName: request.query.name});
        //send the found user
        response.json(user);
    } catch(error) {
        response.json({
            status: "error",
            message: `Database Error: ${error}`,
        });
    }
});
/**
 * users - GET API endpoint that sends all the users in the database
 */
app.get("/users", async (request, response) => {
    try {
        //get all users
        const user = await userModel.find({});
        //send all the users
        response.json(user);
    } catch(error) {
        response.json({
            status: "error",
            message: `Database Error: ${error}`,
        });
    }
});

/**
 * modifyUser - PATCH API endpoint that handles updating the user with the given word
 */
app.patch("/modifyUser", async (request, response) => {
    try {
        //make sure the username is valid
        if(!isNonEmptyString(request.query.name)){
            response.json({
                status: "error",
                message: "userName must be specified",
            });
            return;
        }
        //make sure the word is valid
        if(!isNonEmptyString(request.query.word)){
            response.json({
                status: "error",
                message: "word must be specified",
            });
            return;
        }
        //get the length of the word
        let length = request.query.word.length;
        try{
            //for each letter in the word update the letter count in the user
            for(let i = 0; i < length; i++){
                //update the current letter count
                // { userName: [`${request.query.name}`]} finds the given user
                //{$inc : { [`letters.${request.query.word[i]}`] : 1}}) increases the letter at [i] by one
                await userModel.updateOne({userName: [`${request.query.name}`]}, {$inc : { [`letters.${request.query.word[i]}`] : 1}});
            }
            //update the word count for the given word
            await userModel.updateOne({ userName: [`${request.query.name}`]}, {$inc : { [`words.${request.query.word}`] : 1}});
            if(isNonEmptyString(request.query.guess)){
                await userModel.updateOne({ userName: [`${request.query.name}`]}, {$inc : { [`guessCount.${request.query.guess}`] : 1}});
            }
            response.json({
                userName: request.query.name
            });
        }catch(e){
            console.log(e.message);
            response.json({
                status: "error",
                message: `Database Error: ${e.message}`,
            });
        }
    } catch(error) {
        response.json({
            status: "error",
            message: `Database Error: ${error}`,
        });
    }
});

app.patch("/updateWord", async (request, response) => {
    if(!isNonEmptyString(request.query.word)){
        response.json({
            status: "error",
            message: "word must be specified",
        });
        return;
    }
    const word = request.query.word;
    await currentModel.updateOne({word: `${correctWord.word}`}, {$inc : {totalGuessesUntilFound: 1}});
    await currentModel.updateOne({word: `${word}`}, {$inc : {totalGuesses: 1}});
    if(isNonEmptyString(request.query.guess)){
        let curr = await currentModel.findOne({word: [`${word}`]});
        let total = curr.totalTimesAsCorrect;
        let totalUntilFound = curr.totalGuessesUntilFound;
        let calcNewAverage = totalUntilFound/total;
        await currentModel.updateOne({word: [`${word}`]}, {$set : {averageGuessesUntilFound: calcNewAverage}});
    }
    response.json({
        status: 200,
        word: word,
    });
});