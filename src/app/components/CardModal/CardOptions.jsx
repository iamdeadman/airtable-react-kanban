import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Modal from "react-modal";
import FaTrash from "react-icons/lib/fa/trash";
import MdAlarm from "react-icons/lib/md/access-alarm";
import classnames from "classnames";
import "./CardOptions.scss";
import AirTableService from "../../reducers/AirTableService";

class CardOptions extends Component {
  static propTypes = {
    card: PropTypes.shape({ _id: PropTypes.string.isRequired }).isRequired,
    listId: PropTypes.string.isRequired,
    isCardNearRightBorder: PropTypes.bool.isRequired,
    isThinDisplay: PropTypes.bool.isRequired,
    boundingRect: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = { isCalendarOpen: false, isPriorityOpen: false };
  }

  deleteCard = () => {
    const { dispatch, listId, card } = this.props;
    AirTableService.deleteCardData(window, {cardId: card._id});
    dispatch({
      type: "DELETE_CARD",
      payload: { cardId: card._id, listId }
    });
  };

  render() {
    const {
      isCardNearRightBorder,
      card,
      boundingRect
    } = this.props;

    return (
      <div
        className="options-list"
        style={{
          alignItems: isCardNearRightBorder ? "flex-end" : "flex-start"
        }}
      >
        <div>
          <button onClick={this.deleteCard} className="options-list-button">
            <div className="modal-icon">
              <FaTrash />
            </div>&nbsp;Delete
          </button>
        </div>
      </div>
    );
  }
}

export default connect()(CardOptions);
