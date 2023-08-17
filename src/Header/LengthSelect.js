import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
class LengthSelect  extends React.Component {

    changeLength = event =>{
        let length = parseInt(event.target.id);
        console.log(length);
        this.props.changeGameLength(length);
    }

    render() {
        return (
            <div className={"drop"}>
                <DropdownButton className={"dropButton"} id="dropdown-basic-button" title="Word length">
                    <Dropdown.Item className={"dropItem"} onClick={this.changeLength} id={"5"}>5 Letters</Dropdown.Item>
                    <Dropdown.Item className={"dropItem"} onClick={this.changeLength} id={"6"}>6 Letters</Dropdown.Item>
                    <Dropdown.Item className={"dropItem"} onClick={this.changeLength} id={"7"}>7 Letters</Dropdown.Item>
                </DropdownButton>
            </div>

        );
    }
}

export default LengthSelect;