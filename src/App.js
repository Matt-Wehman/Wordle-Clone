import React from 'react';
import HeaderBar from "./Header/HeaderBar";
import WordleTable from "./Body/WordleTable";
import WordleKeyboard from "./Body/WordleKeyboard";
import {setCorrectWord} from "./Server/WordleAPI";

/**
 Creates the app component
 This component holds the basic structure of the application
 It specifies where each high level element will go in the DOM.
 */
class App extends React.Component {
  //construct the app
  constructor(props) {
    super(props);
    this.state = {
        userFocused: false, //state of if the user is typing in a username
        changeLetters: {},
        isGameFinished: false, //state of if the game is finished
        currentWordGuessCount: 0,
        wonGame: false,
        currUser: "",
        gameLength: 5,
        loadTable: true,
    };

  }
  async getWord(){
      await setCorrectWord(this.state.gameLength);
  }
  render() {
    return (
        <div className="Parent container-fluid">
          {/*The header bar will hold the userName input and title as of now*/}
          {/*The header bar passes if the user is inputting a userName to the app with onFocusChange*/}
          <HeaderBar changeGameLength={length => this.setState({gameLength: length})} currUser = {this.state.currUser} lastWord={this.state.changeLetters} onUserChange = {user => this.setState({currUser: user})} currentWordGuessCount={this.state.currentWordGuessCount} wonGame={this.state.wonGame} isGameFinished={this.state.isGameFinished} onFocusChange={focus => this.setState({userFocused: focus})}/>
          {/*The body holds the wordleDisplay and keyboard*/}
          <div className="body">
            {/*The main Wordle Display. We pass if the user is using the username input to it*/}
              <WordleTable lengthChange = {length => this.setState({gameLength: length}, () => {this.getWord()})} gameLength = {this.state.gameLength} currUser = {this.state.currUser} currentWordGuessCount={count => this.setState({currentWordGuessCount: count})} wonGame={won => this.setState({wonGame: won})}  isGameFinished={finished => this.setState({isGameFinished: finished})} onValidWord={letters => this.setState({changeLetters: letters})} focus={this.state.userFocused}/>
            {/*The wordleKeyboard container hold the keyboard so we can easily manipulate the whole board*/}
            <div className="wordleKeyboardContainer container-fluid">
              <WordleKeyboard gameLength = {this.state.gameLength} lettersToChange={this.state.changeLetters}/>
            </div>
          </div>
        </div>
    );
  }
}

export default App;