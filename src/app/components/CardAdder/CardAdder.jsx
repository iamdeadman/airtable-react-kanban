import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Textarea from "react-textarea-autosize";
import shortid from "shortid";
import ClickOutside from "../ClickOutside/ClickOutside";
import "./CardAdder.scss";
import AirTableService from "../../reducers/AirTableService";
import ImageLoader from "../../../assets/images/loading.gif";
import classnames from "classnames";

class CardAdder extends Component {
  static propTypes = {
    listId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {
      newTitle: "",
      isOpen: false,
      isLoading: false
    };
  }

  toggleCardComposer = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleChange = event => {
    this.setState({ newTitle: event.target.value });
  };

  handleKeyDown = event => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      this.handleSubmit(event);
    } else if (event.keyCode === 27) {
      this.toggleCardComposer();
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const { newTitle } = this.state;
    const { listId, dispatch, listTitle } = this.props;
    if (newTitle === "") return;

    const AIR_PAYLOAD = {Name: newTitle};
    if(listTitle !== "uncategorized") AIR_PAYLOAD["Priority"] = listTitle;
    this.setState({ isLoading: true });
    AirTableService.addCardData(window, AIR_PAYLOAD).then(response => {
      try {
        dispatch({
          type: "ADD_CARD",
          payload: { cardText: newTitle, cardId: response.data.data, listId, listTitle }
        });
        this.toggleCardComposer();
        this.setState({ newTitle: "",  isLoading: false });
      } catch(error){
        console.error(error)
      }
    }).catch(error => {
      console.error(error);
    });
  };

  render() {
    const { newTitle, isOpen, isLoading } = this.state;
    return isOpen ? (
      <ClickOutside handleClickOutside={this.toggleCardComposer}>
        <form
          onSubmit={this.handleSubmit}
          className="card-adder-textarea-wrapper"
        >
          <Textarea
            autoFocus
            useCacheForDOMMeasurements
            minRows={1}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            value={newTitle}
            className="card-adder-textarea"
            placeholder="Add a new card..."
            spellCheck={false}
            onBlur={this.toggleCardComposer}
          />
          <img src={ImageLoader} className={classnames("loader-icon", {
            "hide": !isLoading
          })} />
        </form>
      </ClickOutside>
    ) : (
      <button onClick={this.toggleCardComposer} className="add-card-button">
        +
      </button>
    );
  }
}

export default connect()(CardAdder);
