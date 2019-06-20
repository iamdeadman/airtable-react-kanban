import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Textarea from "react-textarea-autosize";
import classnames from "classnames";
import "./ListHeader.scss";
import FaCompress from "react-icons/lib/fa/compress";
import FaExpand from "react-icons/lib/fa/expand";

class ListHeaderVertical extends Component {
    static propTypes = {
        listTitle: PropTypes.string.isRequired,
        listId: PropTypes.string.isRequired,
        boardId: PropTypes.string.isRequired,
        cards: PropTypes.arrayOf(PropTypes.string).isRequired,
        dragHandleProps: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            newTitle: props.listTitle
        };
    }

    toggleList = () => {
        const { listId, boardId, dispatch } = this.props;
        dispatch({type: "TOGGLE_LIST", payload: {listId, boardId}});
    };

    handleButtonKeyDown = event => {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    };

    render() {
        const { dragHandleProps, listTitle, isCollapsed, cards} = this.props;
        return (
            <div className="list-header">
                <div
                    {...dragHandleProps}
                    role="button"
                    tabIndex={0}
                    onKeyDown={event => {
                        this.handleButtonKeyDown(event);
                        dragHandleProps.onKeyDown(event);
                    }} className="list-title-button">
                    <span className="list-cards-count">
                        {cards.length} records
                    </span>
                    <span className={classnames(listTitle.toLowerCase())}>{listTitle}</span>
                </div>
                <div className="toggle-list-button" onClick={this.toggleList}>
                    {!isCollapsed ? (
                        <FaExpand />
                    ) : (
                        <FaCompress />
                    )}
                </div>
            </div>
        );
    }
}

export default connect()(ListHeaderVertical);
