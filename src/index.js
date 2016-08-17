import ReactDOM from 'react-dom';
import './index.css';
import React, { Component } from 'react';
import reqwest from 'reqwest';
import { Grid } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Image } from 'react-bootstrap';

const streams = [
  'ESL_SC2',
  'brunofin',
  'OgamingSC2',
  'cretetion',
  'freecodecamp',
  'storbeck',
  'habathcx',
  'RobotCaleb',
  'noobs2ninjas',
  'comster404'];

const ClosedAccount = ({item}) => (
  <div className="list-group-item disabled clearfix">
      <h4 className="list-group-item-heading">{item}</h4>
      <p className="list-group-item-text">
        This Channel has been Discontinued.
      </p>
  </div>
);

const StreamingChannel = (props) => (
  <a href={props.data.stream.channel.url} target="_blank" className="list-group-item clearfix">
    <div className="pull-left channelthumb">
      <Image src={props.data.stream.channel.logo} circle />
    </div>
    <h4 className="list-group-item-heading">{props.data.stream.channel.display_name}</h4>
    <p className="list-group-item-text">
      {props.data.stream.channel.game}: {props.data.stream.channel.status}
    </p>
  </a>
);

class SleepingChannel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: undefined
    }
  }

  componentDidMount() {
    reqwest({
      url: 'https://api.twitch.tv/kraken/channels/' + this.props.item,
      type: 'jsonp',
      success: (result) => {
        console.log(result);
        this.setState({
          result: result
        });
      }
    });
  }

  render() {
    if (this.state.result) {
      return (
        <a href={this.state.result.url} target="_blank" className="list-group-item clearfix">
          <div className="pull-left channelthumb">
            <Image src={this.state.result.logo} circle />
          </div>
          <h4 className="list-group-item-heading">{this.state.result.display_name}</h4>
          <p className="list-group-item-text">
            -Currently Offline-
          </p>
        </a>
      );
    } else {
      return (
        <span></span>
      );
    }
  }
}

SleepingChannel.propTypes = {

};

class Stream extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: undefined
    }
  }

  queryTwitchTV(stream) {
    reqwest({
      url: 'https://api.twitch.tv/kraken/streams/' + stream,
      type: 'jsonp',
      success: (result) => {
        //console.log(result);
        this.setState({
          result: result
        });
      }
    });
  }

  componentDidMount() {
    this.queryTwitchTV(this.props.item);
  }

  render() {
    if (this.state.result !== undefined) {
      if (this.state.result.status === 422) {
        return (
          <ClosedAccount item={this.props.item} />
        )
      } else if (this.state.result.stream !== null) {
        return (
          <StreamingChannel data={this.state.result} />
        )
      } else {
        return (
          <SleepingChannel item={this.props.item} />
        )
      }
    } else {
      return (
        <div>
          Loading...
        </div>
      )
    }
  }
}

Stream.propTypes = {
  item: React.PropTypes.string.isRequired,
};

const App = () => (
  <Grid>
    <Row className="App">
      <Col md={6} mdOffset={3}>
        <div className="panel panel-success">
          <div className="panel-heading">
              TwitchTV Streams
          </div>
          <div className="list-group">
            {streams.map((item, idx) => <Stream item={item} key={idx} />)}
          </div>
        </div>
      </Col>
    </Row>
  </Grid>
);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
