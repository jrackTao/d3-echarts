import React, {Component} from 'react';
import MapView from './MapView';
import ForceRelation from './ForceRelation';
import './style.scss';

export default class App extends Component {
  state = {
    nodes: []
  };

  renderView = nodes => {
    // console.log(nodes);
    this.setState({
      nodes
    });
  };

  render() {
    const {nodes} = this.state;
    return (
      <div style={{position: 'relative', width: 800}}>
        <ForceRelation
          nodes={nodes}
          style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}}
        ></ForceRelation>
        <MapView renderView={this.renderView}></MapView>
      </div>
    );
  }
}
