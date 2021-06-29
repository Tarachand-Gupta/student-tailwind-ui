import React, { Component } from "react";
import Avatar from "../chatList/Avatar";
import ReactTimeAgo from 'react-time-ago'

export default class ChatItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        style={{ animationDelay: `0.8s` }}
        className={`chat__item ${this.props.user ? this.props.user : ""}`}
      >
        <div className="chat__item__content">
          <div className="chat__msg">{this.props.msg}</div>
          {this.props.mediaLink != "" &&
            <> <hr />
              <div className="chat__msg">{this.props.mediaLink}</div>
            </>}
          <div className="chat__meta">
            {
              this.props.timeAgo
              &&
              <span><ReactTimeAgo date={this.props.timeAgo} locale="en-US" /></span>
            }
            {this.props.scope != "" &&
              <span>Scope {this.props.scope}</span>}
          </div>
        </div>
        <Avatar isOnline="active" image={this.props.image} />
      </div>
    );
  }
}
