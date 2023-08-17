import React from 'react';
import * as API from '../Server/WordleAPI.js';


/**
 * Creates the UserName component
 * This houses the text field and enter button for the username input group.
 */
class UserName extends React.Component {
    render(){
        /**
         * Handles when the user clicks enter button
         * @param event
         */
        const handleEnter = async event => {
            let input;
            try{
                input = document.getElementById("userName").value;
                if(input === "admin"){
                    //Dude this is so secure, nobody could ever hack into this.
                    document.getElementById("adminPanelButton").hidden = false;
                } else {
                    document.getElementById("adminPanelButton").hidden = true;
                    const res = await API.createUser(input);
                    console.log("User not found. Created new user.");
                    this.props.onUserChange(res.userName);
                }

            }catch(err){
                if(err.message === "The User already exists"){
                    console.log("User already exists, switched to that user.");
                    this.props.onUserChange(input);
                }else if(err.message === "Username must be a non-empty string"){
                    console.log("Username not specified. Not switching to new user.");
                }
            }
        };




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

        const userClickStats = event => {
            this.props.onStatsOpen();
        }

        return(
            <div className="inputGroupandStats">
                <div className="input-group mb-3 userNameGroup"> {/*Specifies that this will be a group of input types and will have a bottom margin of 3.
                                                            This creates the username input group*/}
                    <div className="input-group-prepend"> {/*Specifies that this div holds and input that will go first in the group*/}
                        <button onClick={handleEnter} className="btn btn-outline-secondary enterBtn" type="button">Enter</button>{/*The enter button for the username input*/}
                    </div>
                    {/*Creates the username text field*/}
                    <input id = "userName" onFocus={handleFocus} onBlur={handleUnFocus} ref={ref => this.userInput = ref} type="text" className="name form-control mb-2 mr-sm-2" placeholder="Enter Username..." />
                </div>
                <button onClick={userClickStats} className="btn btn-outline-secondary userStatsBtn">User-Stats</button>
            </div>
        );
    }
}

export default UserName;