import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import FaUserSecret from "react-icons/lib/fa/user-secret";
import kanbanLogo from "../../../assets/images/logo@2x.png";
import "./Header.scss";

class Header extends Component {
  static propTypes = { user: PropTypes.object };
  render = () => {
    const { user } = this.props;
    return (
      <header>
        <Link to="/" className="header-title">
          <img src={kanbanLogo} alt="Airtable Kanban logo" />
          &nbsp;Airtable Kanban
        </Link>
        <div className="header-right-side">
            <FaUserSecret className="guest-icon" />
        </div>
      </header>
    );
  };
}

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(Header);
