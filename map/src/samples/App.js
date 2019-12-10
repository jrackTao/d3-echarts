import React, {Component} from 'react';
import MapView from './MapView';
import ForceRelation from './ForceRelation';
import './style.scss';

export default class App extends Component {
  state = {
    nodes: [],
    config: {
      width: 800,
      height: 600,
    }
  };

  renderView = nodes => {
    nodes = nodes.map(node => {
      const value = new Array(~~(Math.random() * 6))
        .fill(0)
        .map(
          i =>
            node.name +
            new Array(~~(Math.random() * 5 + 2)).fill('医院').join('')
        );
      let maxLen = 0;
      value.forEach(v => v.length > maxLen && (maxLen = v.length));
      node.layout = {
        width: maxLen * 15 + 10,
        height: value.length * 15 + 10
      };
      node.value = value;
      return node;
    });
    this.setState({
      nodes
    });
  };

  render() {
    const {nodes, config} = this.state;
    return (
      <div style={{position: 'relative', width: config.width}}>
        <ForceRelation
          config={config}
          nodes={nodes}
          style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}}
        ></ForceRelation>
        <MapView renderView={this.renderView} config={config}></MapView>
      </div>
    );
  }
}
