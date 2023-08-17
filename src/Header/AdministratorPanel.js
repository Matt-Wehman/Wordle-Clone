import React from "react";
import {addWordToList, getWord} from "../Server/WordleAPI"
import Console from 'simple-react-console';
//https://pixeledpie.com/simple-react-console/index.html
class AdministratorPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            output: {string: 'Welcome, Administrator, how can I help you?', id:'command'}
        };
    }

    async displayCurrentWord(){ //returns the current word.
        const word = await getWord();
        //funny word chain
        if(word === "No word has been generated yet."){
            return {output: word};
        }else{
            return {output: `The current word is ${word.word}`};
        }
    }

    render() {
        window.onclick = function (event) {
            const stats = document.getElementById("adminPanel");
            if(event.target === stats){
                stats.style.display = "none";
            }
        };

        const userClickAdmin = event => {
            const admin = document.getElementById("adminPanel");
            this.props.onFocusChange(true);
            admin.style.display = "block";
        };

        const addWord = () => {
            //todo make this last between sessions. May have to do some mongodb stuff.
            //this is very scuffed, not sure if this will work.
            let input = document.getElementById("addWordInput").value;
            //hardcoded as 5 for now, too lazy to make it based on actual amount
            if(!/[^a-zA-Z]/.test(input)){
                //check if input is of length 5 and it only has letters in it.
                addWordToList(input).then(() => {alert(`Added ${input} to the ${input.length} letter word list`);}).catch(err => {alert(err)});
            } else {
                alert("Could not add word to the list.");
            }
        }

        const exitAdmin = event => {
            const admin = document.getElementById("adminPanel");
            admin.style.display = "none";
            this.props.onFocusChange(false);
        };

        const onResponse = async (response) => {
            console.log('response id: ' + response.id);
            console.log('response value: ' + response.value);
            const command = response.value.split(" "); //list of args seperated by spaces
            switch (command[0]){ //get the first word in the user response. A command cannot have a space.
                case "currentword": await this.setState(await this.displayCurrentWord()); break;
                case "help": this.setState(displayCommands()); break;
                default: this.setState({
                    output: `Unknown Command \"${await this.displayCurrentWord()}\", type help for a list of commands.  `
                });
            }
        };


        //IMPORTANT: UPDATE THIS AS COMMANDS ARE ADDED!!!!.
        const displayCommands = () =>{
            return {output: "Command List: help, currentword"};
        }

        /**
         * Handles when the user clicks onto the username text input
         * @param event
         */
        const handleFocus = event => {
            this.props.onFocusChange(true); //pushes that the user is NOT focused on this element to the headerBar
        }
        /**
         * Handles when the user clicks off of the username text input
         * @param event
         */
        const handleUnFocus = event => {
            this.props.onFocusChange(false); //pushes that the user IS focused on this element to the headerBar
        }

        //this won't update the correct word if we can redo it. Make sure to change it.
        return(
            <div className="admin">
                <button onClick={userClickAdmin} className="btn btn-outline-secondary userStatsBtn" id="adminPanelButton" hidden={true}>Admin Panel</button>
                <div id="adminPanel" className="modal">
                    <div className="modal-header">
                        <h1 style={{color: "black"}}>Admin Panel</h1>
                        <span onClick={exitAdmin} className="close">&times;</span>
                    </div>
                    <div style={{borderRadius: "0 0 10px 10px"}} className="modal-content">
                        <p>The current word is: {this.props.correctWord}</p>
                        <span>
                        <input id = "addWordInput" type="text" className="name form-control mb-2 mr-sm-2" placeholder="Add new word..." />
                        <button onClick={addWord}>Add</button>
                        </span>
                        <Console id="adminconsole" passive={false} backgroundColor='gray' onFocus={handleFocus} onBlur={handleUnFocus} className="name form-control mb-2 mr-sm-2" showHeader={true} onResponse={onResponse} setOutput={this.state.output}/>
                    </div>
                    </div>

            </div>

        );
    }

}

export default AdministratorPanel;