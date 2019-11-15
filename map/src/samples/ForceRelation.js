import React, { Component } from 'react';
import './style.scss';
import * as d3 from 'd3';
import _ from 'lodash';
// var nodes = [{id: 'Alice'}, {id: 'Bob'}, {id: 'Carol'}];

const config = {
  width: 800,
  height: 500
};

var links = [
  { source: 0, target: 1 }, // Alice → Bob
  { source: 1, target: 2 } // Bob → Carol
];

export default class App extends Component {
  state = {
    nodes: []
  };
  nodes = [];
  links = [];
  componentDidMount() {
    // var simulation = d3.forceSimulation([]);
    // this.initView();
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    let { nodes } = nextProps;
    // var center = {
    //   center:[400,250],
    //   x:400,
    //   y:250,
    // };
    nodes = nodes.map((node, index) => ({ ...node, x: node.center[0], y: node.center[1] }));

    // this.nodes = [center,..._.cloneDeep(nodes),..._.cloneDeep(nodes)];
    this.nodes = _.cloneDeep(nodes);
    this.links = nodes.map((node, index) => ({
      source: index,
      target: index
    }));
    this.initView();
  }

  initView = () => {
    console.log(this.nodes);
    var simulation = d3
      .forceSimulation(this.nodes)
      // 弹力
      // .force('link', d3.forceLink(this.links).strength(-200).distance(10))
      // 向心力
      // .force('center', d3.forceCenter(config.width / 2, config.height / 2))
      .force('radial', d3.forceRadial(config.height / 2, config.width / 2, config.height / 2).strength(0.1))
      // 万有引力
      // .force('charge', d3.forceManyBody().strength(-50))
      // 碰撞
      .force(
        'collide',
        d3
          .forceCollide(0)
          .strength(0.1)
          .iterations(5)
          .radius(50)
      );
    // 用指定的x坐标和y坐标创建一个居中力。
    simulation.on('tick', this.ticked);
    simulation.on('end', this.end);
  };

  ticked = () => {
    this.setState({});
    // console.log(nodes, links);
  };

  end = () => {
    console.log(this.nodes, this.links);
  };

  render() {
    const { style } = this.props;
    return (
      <div style={style} onClick={() => { }}>
        {this.nodes.map(node => (
          <div className="box-c" style={{ left: node.x, top: node.y }}>
            <div className="box-r">
              <div className="box-l"></div>
              <div className="box-v">{node.name}</div>
            </div>
          </div>
        ))}
        <svg width="100%" height="100%" viewBox="0 0 800 500">
          {this.nodes.map(link => {
            const {
              center: [x1, y1],
              x: x2,
              y: y2
            } = link;
            return <line x1={x1} y1={y1} x2={x2} y2={y2} className="link" />;
          })}
        </svg>
      </div>
    );
  }
}
