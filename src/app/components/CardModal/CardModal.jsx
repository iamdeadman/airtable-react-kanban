import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Textarea from "react-textarea-autosize";
import Modal from "react-modal";
import CardBadges from "../CardBadges/CardBadges";
import CardOptions from "./CardOptions";
import { findCheckboxes } from "../utils";
import "./CardModal.scss";
import AirTableService from "../../reducers/AirTableService";

class CardModal extends Component {
  static propTypes = {
    card: PropTypes.shape({
      title: PropTypes.string,
      _id: PropTypes.string.isRequired,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      color: PropTypes.string
    }).isRequired,
    listId: PropTypes.string.isRequired,
    cardElement: PropTypes.shape({
      getBoundingClientRect: PropTypes.func.isRequired
    }),
    isOpen: PropTypes.bool.isRequired,
    toggleCardEditor: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      newText: props.card.text,
      newTitle: props.card.title,
      isColorPickerOpen: false,
      isTextareaFocused: false
    };
    if (typeof document !== "undefined") {
      Modal.setAppElement("#app");
    }
  }

  componentWillReceiveProps = nextProps => {
    this.setState({ newText: nextProps.card.text, newTitle: nextProps.card.title });
  };

  handleKeyDown = event => {
    console.log("keydonw");
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();
      this.submitCard();
    }
  };

  submitCard = () => {
    const { newText, newTitle } = this.state;
    const { card, listId, dispatch, toggleCardEditor } = this.props;
    if (newTitle !== card.title || newText !== card.text) {
      AirTableService.updateCardData(window, {cardId: card._id, board: {Description: newText, Name: newTitle}});
      dispatch({
        type: "CHANGE_CARD_TEXT",
        payload: {
          cardTitle: newTitle,
          cardText: newText,
          cardId: card._id,
          listId
        }
      });
    }
    toggleCardEditor();
  };

  handleChange = event => {
    this.setState({ newText: event.target.value });
  };

  handleTitleChange = event => {
    this.setState({ newTitle: event.target.value });
  };

  toggleColorPicker = () => {
    this.setState({ isColorPickerOpen: !this.state.isColorPickerOpen });
  };

  handleRequestClose = () => {
    const { isColorPickerOpen } = this.state;
    const { toggleCardEditor } = this.props;
    if (!isColorPickerOpen) {
      toggleCardEditor();
    }
    this.submitCard();
  };

  render() {
    const { newText = "", isColorPickerOpen, isTextareaFocused, newTitle } = this.state;
    const { cardElement, card, listId, isOpen } = this.props;
    if (!cardElement) {
      return null;
    }

    // Get number of checked and total checkboxes
    const checkboxes = findCheckboxes(newText);

    /*
    Create style of modal in order to not clip outside the edges no matter what device.
    */

    // Get dimensions of the card to calculate dimensions of cardModal.
    const boundingRect = cardElement.getBoundingClientRect();

    // Returns true if card is closer to right border than to the left
    const isCardNearRightBorder =
      window.innerWidth - boundingRect.right < boundingRect.left;

    // Check if the display is so thin that we need to trigger a centered, vertical layout
    // DO NOT CHANGE the number 550 without also changing related media-query in CardOptions.scss
    const isThinDisplay = window.innerWidth < 550;

    // Position textarea at the same place as the card and position everything else away from closest edge
    const style = {
      content: {
        top: Math.min(
          boundingRect.top,
          window.innerHeight - boundingRect.height - 18
        ),
        left: isCardNearRightBorder ? null : boundingRect.left,
        right: isCardNearRightBorder
          ? window.innerWidth - boundingRect.right
          : null,
        flexDirection: isCardNearRightBorder ? "row-reverse" : "row"
      }
    };

    // For layouts that are less wide than 550px, let the modal take up the entire width at the top of the screen
    const mobileStyle = {
      content: {
        flexDirection: "column",
        top: 3,
        left: 3,
        right: 3
      }
    };

    return (
      <Modal
        closeTimeoutMS={150}
        isOpen={isOpen}
        onRequestClose={this.handleRequestClose}
        contentLabel="Card editor"
        overlayClassName="modal-underlay"
        className="modal"
        style={isThinDisplay ? mobileStyle : style}
        includeDefaultStyles={false}
        onClick={this.handleRequestClose}
      >
        <div
          className="modal-textarea-wrapper"
          style={{
            minHeight: isThinDisplay ? "none" : boundingRect.height,
            width: isThinDisplay ? "100%" : boundingRect.width,
            boxShadow: "0px 0px 3px 2px rgb(0, 180, 255)",
            background: card.color
          }}
        >
          <Textarea
              useCacheForDOMMeasurements
              value={newTitle}
              onChange={this.handleTitleChange}
              onKeyDown={this.handleKeyDown}
              className="modal-textarea modal-textarea-title"
              spellCheck={true}
              onFocus={() => this.setState({ isTextareaFocused: true })} />

          <Textarea
              useCacheForDOMMeasurements
              value={newText}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              className="modal-textarea"
              spellCheck={true}
              onFocus={() => this.setState({ isTextareaFocused: true })} />
          {(card.date || checkboxes.total > 0) && (
            <CardBadges date={card.date} checkboxes={checkboxes} />
          )}
        </div>
        <CardOptions
          isColorPickerOpen={isColorPickerOpen}
          card={card}
          listId={listId}
          boundingRect={boundingRect}
          isCardNearRightBorder={isCardNearRightBorder}
          isThinDisplay={isThinDisplay}
          toggleColorPicker={this.toggleColorPicker}
        />
      </Modal>
    );
  }
}

export default connect()(CardModal);
