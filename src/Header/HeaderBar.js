import React from 'react';
import UserName from './UserName';
import UserStats from './UserStats';
import AdministratorPanel from './AdministratorPanel';
import LengthSelect from "./LengthSelect";

/**
 * Creates the HeaderBar component
 * This component will hold the title and the username input. (probably will hold more later)
 */
class HeaderBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currUser: "",
            focused: false,
            displayStats: false,
            gameLength: 5
        };
    }
    render(){
        return(
            <div style={{display:"flex"}} className="header container-fluid">
                {/*The UserName component passes if it is currently being used to the HeaderBar*/}
                <UserName onStatsOpen = {display => this.setState({displayStats: true})} onUserChange = {user => this.props.onUserChange(user)} onFocusChange={(focus) => {this.props.onFocusChange(focus); this.setState({focused: focus})}}/>
                <h1>Wordle</h1> {/*The title*/}
                {this.state.displayStats ? <UserStats onExit = {display => this.setState({displayStats: display})} focus = {this.state.focused} lastWord = {this.props.lastWord} currUser={this.props.currUser} isGameFinished={this.props.isGameFinished} wonGame={this.props.wonGame} currentWordGuessCount={this.props.currentWordGuessCount}/> : <div></div>}
                <AdministratorPanel correctWord={this.props.correctWord} onFocusChange={(focus) => {this.props.onFocusChange(focus); this.setState({focused: focus})}}/>
                <LengthSelect changeGameLength = {length => this.props.changeGameLength(length)}></LengthSelect>
            </div>
        );
    }
}

export default HeaderBar;