import React, {Component} from 'react';
import './style.scss';
import * as d3 from 'd3';
import _ from 'lodash';
// var nodes = [{id: 'Alice'}, {id: 'Bob'}, {id: 'Carol'}];

var links = [
  {source: 0, target: 1}, // Alice → Bob
  {source: 1, target: 2} // Bob → Carol
];

export default class App extends Component {
  state = {
    nodes: []
  };
  nodes = [];
  links = [];
  static defaultProps = {
    config: {
      width: 800,
      height: 500
    }
  };
  componentDidMount() {
    // var simulation = d3.forceSimulation([]);
    // this.initView();
  }

  componentWillReceiveProps(nextProps) {
    let {nodes} = nextProps;

    this.nodes = _.cloneDeep(nodes).map((node, index) => ({
      ...node,
      x: node.center[0],
      y: node.center[1]
    }));
    this.links = nodes.map((node, index) => ({
      source: index,
      target: index
    }));

    this.initView();
  }

  initView = () => {
    const {config} = this.props;
    var simulation = d3
      .forceSimulation(this.nodes)
      .force(
        'radial',
        d3
          .forceRadial(config.height / 2, config.width / 2, config.height / 2)
          .strength(0.1)
      )
      // 碰撞
      .force(
        'collide',
        d3
          .forceCollide(0)
          .strength(0.1)
          .iterations(5)
          .radius(this.calcNodeRadius)
      );
    // 用指定的x坐标和y坐标创建一个居中力。
    simulation.on('tick', this.ticked);
    simulation.on('end', this.end);
  };

  calcNodeRadius = node => {
    const {
      layout: {width, height}
    } = node;
    const r = width > height ? width / 2 : height / 2;
    console.log('radius', r);
    return r;
  };

  ticked = () => {
    const {config} = this.props;
    this.nodes.forEach(node => {
      const {width, height} = node.layout;
      if (node.x < width / 2) {
        node.x = width / 2;
      }
      if (node.x > config.width - width / 2) {
        node.x = config.width - width / 2;
      }
      if (node.y < height / 2) {
        node.y = height / 2;
      }
      if (node.y > config.height - height / 2) {
        node.y = config.height - height / 2;
      }
    });
    this.setState({});
  };

  end = () => {
    console.log(this.nodes, this.links);
  };

  render() {
    const {style, config} = this.props;
    return (
      <div style={style} onClick={() => {}}>
        {this.nodes.map(node => {
          if (node.value.length) {
            return (
              <div
                key={node.name}
                className="box-c"
                style={{left: node.x, top: node.y}}
              >
                {node.value.map(v => (
                  <div className="box-r">
                    <div className="box-l"></div>
                    <div className="box-v">{v}</div>
                  </div>
                ))}
              </div>
            );
          }
          return null;
        })}
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${config.width} ${config.height}`}
        >
          {this.nodes.map(node => {
            const {
              center: [x1, y1],
              x: x2,
              y: y2
            } = node;
            if (node.value.length) {
              return (
                <line
                  key={node.name}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className="link"
                />
              );
            }
            return null;
          })}
        </svg>
      </div>
    );
  }
}
