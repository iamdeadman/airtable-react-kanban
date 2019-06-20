import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Draggable } from "react-beautiful-dnd";
import classnames from "classnames";
import ListHeader from "./ListHeader";
import ListHeaderVertical from "./ListHeaderCollapsed";
import Cards from "./Cards";
import CardAdder from "../CardAdder/CardAdder";
import "./List.scss";

class List extends Component {
  static propTypes = {
    boardId: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    list: PropTypes.shape({ _id: PropTypes.string.isRequired }).isRequired
  };

  render = () => {
    const { list, boardId, index } = this.props;
    return (
      <Draggable
        draggableId={list._id}
        index={index}
        disableInteractiveElementBlocking
      >
        {(provided, snapshot) => (
          <>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className={classnames("list-wrapper", {
                  "list-is-collapsed": list.isCollapsed
              })}
            >
              <div
                className={classnames("list", {
                  "list--drag": snapshot.isDragging
                })}
              >
                {!list.isCollapsed ? (
                    <div>
                      <ListHeader
                          dragHandleProps={provided.dragHandleProps}
                          listTitle={list.title}
                          listId={list._id}
                          cards={list.cards}
                          isCollapsed={list.isCollapsed}
                          boardId={boardId}
                      />
                      <div className="cards-wrapper">
                        <Cards listId={list._id} />
                      </div>
                      <div className="text-center">
                        <CardAdder listId={list._id} listTitle={list.title} />
                      </div>
                    </div>
                ) : (
                    <ListHeaderVertical
                        dragHandleProps={provided.dragHandleProps}
                        listTitle={list.title}
                        listId={list._id}
                        cards={list.cards}
                        boardId={boardId}
                        isCollapsed={list.isCollapsed}
                    />
                )}
              </div>
            </div>
            {provided.placeholder}
          </>
        )}
      </Draggable>
    );
  };
}

export default connect()(List);
