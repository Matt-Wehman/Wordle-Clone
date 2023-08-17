const getUsersURL = "http://localhost:3001/users";
const getUsersByNameURL = "http://localhost:3001/userByName";
const createUserURL = "http://localhost:3001/addUser";
const updateUserURL = "http://localhost:3001/modifyUser";
const setCorrectWordURL = "http://localhost:3001/setCorrectWord";
const compareWordsURL = "http://localhost:3001/compareWords";
const addWordURL = "http://localhost:3001/addWord";
const updateWordURL = "http://localhost:3001/updateWord";
const getWordURL = "http://localhost:3001/getWord";

/**
 * getUser - Calls GET user endpoint to retrieve all current users
 */
export const getUsers = async () => {
    // Request the list of all users
    const response = await fetch(getUsersURL);

    // Check for a valid HTTP response
    if(response.ok !== true) {
        throw new Error(response.statusText);
    }

    // Retrieve the users
    const results = await response.json();
    if(results.status === "error"){
        throw new Error(results.message);
    }
    // Return the results
    return results;
};

export const getWord = async () => {
    const response = await fetch(getWordURL);
    const resJSON = await response.json();
    if(resJSON.status === "success"){
        return resJSON.word;
    } else {
        return "No word has been generated yet.";
    }
}

export const setCorrectWord = async (wordLength) =>{
    const response = await fetch(`${setCorrectWordURL}?length=${wordLength}`, {
        method: "POST"
    });
    if(response.ok !== true) {
        throw new Error(response.statusText);
    }
    // Retrieve the created user
    const results = await response.json();
    if(results.status === "error") {
        throw new Error(results.message);
    }
    // Return the success message
    return results.message;
}

export const addWordToList = async (word) =>{
    const response = await fetch(`${addWordURL}?word=${word}`, {
        method: "PATCH"
    });
    //check for error code
    if(response.ok !== true) {
        throw new Error(response.statusText);
    }
    //wait for server response to fetch request
    const results = await response.json();
    if(results.status === "error" && results.message === "Word is invalid") {
       throw new Error(results.message);
    }
    //return the success response
    return results.message;
}
export const compareWords = async (word) =>{
    const response = await fetch(`${compareWordsURL}?word=${word}`);
    if(response.ok !== true) {
        throw new Error(response.statusText);
    }

    const results = await response.json();
    if(results.status === "error" && results.message === "Word is invalid") {
        return "Word is invalid";
    }
    //return the letters
    return results;
}
/**
 * getUserByName - Calls GET userByName endpoint to retrieve the user with the given name
 * @param user user's name
 * @returns {Promise<any>} the user
 */

export const getUserByName = async (user) => {
    //Request the use with the given name
    const response = await fetch(`${getUsersByNameURL}?name=${user}`);

    //Check for valid response
    if(response.ok !== true) {
        throw new Error(response.statusText);
    }

    //retrieve the user
    const results = await response.json();
    if(results.status === "error") {
        throw new Error(results.message);
    }

    //return the user
    return results;
};

/**
 * createUser - calls POST addUser endpoint to create a new user with the given name
 * @param name user's name
 * @returns {Promise<any>} the created user
 */
export const createUser = async (name) => {
    //Send user data to server
    const response = await fetch(`${createUserURL}?name=${name}`, {
        method: 'POST'
    });
    // Check for a valid HTTP response
    if(response.ok !== true) {
        throw new Error(response.statusText);
    }

    // Retrieve the created user
    const results = await response.json();
    if(results.status === "error") {
        throw new Error(results.message);
    }
    // Return the new user
    return results.user;
};

export const updateWord = async (word, guessNum) =>{
    const response = await fetch(`${updateWordURL}?word=${word}&guess=${guessNum}`, {
        method: 'PATCH'
    });
    // Check for a valid HTTP response
    if(response.ok !== true) {
        throw new Error(response.statusText);
    }

    // Retrieve the created user
    const results = await response.json();
    if(results.status === "error") {
        throw new Error(results.message);
    }
    // Return the new user
    return results;
}

/**
 * updateUser - Calls the PATCH endpoint to update the user. Will update the user's used letters and words.
 * @param name - The name of the user to update
 * @param word the word to update the user with
 * @returns {Promise<any>} the updated user
 */
export const updateUser = async (name,word, guessNum) => {
    // Request the update with name and word
    const response = await fetch(`${updateUserURL}?name=${name}&word=${word}&guess=${guessNum}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    // Check for a valid HTTP response
    if(response.ok !== true) {
        throw new Error(response.statusText);
    }
    // Make sure the update was made correctly
    const results = await response.json();
    if(results.status === "error") {
        throw new Error(results.message);
    }
    // Return the updated user
    return results;
};