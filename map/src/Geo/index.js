import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import {PALETTES, COLORS, LEGEND_ICONS} from './config/config';
import _ from 'lodash';
import colors, {DEFAULT_COLORS} from './config/colors';
import './style.scss';

export default class Map extends Component {
  static defaultProps = {
    renderView: () => {},
    rootSize:14,
    config:{
      width:800,
      height:500
    }
  };

  state = {
    prevProps: {}
  };

  chartRef = React.createRef();

  static getDerivedStateFromProps(props, state) {
    const {mapName, geoJson} = props;
    const {prevProps} = state;

    if (!Object.is(mapName, _.get(prevProps, 'mapName', ''))) {
      // register map && remove default position for label of region
      echarts.registerMap(mapName, {
        ...geoJson,
        features: geoJson.features.map(v => ({
          ...v,
          properties: {
            name: v.properties.name,
            childNum: v.properties.childNum
          }
        }))
      });
    }
    return {
      ...state,
      prevProps: props
    };
  }

  getOption() {
    const {
      palette,
      rootSize,
      mapName,
      geoJson,
      level,
    } = this.props;

    const fontSize = rootSize;

    const regions = _.get(geoJson, 'features', []).map(v => ({
      name: v.properties.name,
      id: v.id
    }));

    const option = {
      color: palette,
      tooltip: {
        triggerOn: 'mousemove',
        formatter: v => v.name
      },
      animation: true,
      geo: {
        map: mapName,
        regions: regions,
        label: {
          show: false,
          fontSize: fontSize,
          color: COLORS.PRIMARY,
          position: ['50%', '50%']
        },
        itemStyle: {
          areaColor: 'rgba(0,0,0,0.5)',
          borderColor: COLORS.GEO_BORDER,
          borderWidth: fontSize * 0.08,
          shadowBlur: 120,
          shadowColor: '#24a7ff'
        },
        emphasis: {
          label: {
            color: COLORS.SECONDARY
          },
          itemStyle: {
            areaColor: '#205885',
            color: 'rgba(255,128,32,0.8)'
          }
        }
      },
      // series: [
      //   {
      //     name: mapName,
      //     type: 'map',
      //     // roam: true,
      //     color: '#fff',
      //     map: mapName,
      //     label: {
      //       show: true,
      //       formatter: ({data = {}, name}) => {
      //         const {value} = data;
      //         if (value) {
      //           const list = value.map(
      //             item =>
      //               `{gradeB${item.grade}|}{p1|}{grade${item.grade}|${item.name}}`
      //           );
      //           return list.join('\n');
      //         }
      //         return '';
      //       },
      //       backgroundColor: 'rgba(255,255,255,.6)',
      //       padding: 5,
      //       borderRadius: 3,
      //       borderWidth: 2,
      //       borderColor: '#fff',
      //       rich: {
      //         gradeB1: {
      //           backgroundColor: '#3061b8',
      //           borderRadius: 10,
      //           height: 10,
      //           width: 10
      //         },
      //         gradeB2: {
      //           backgroundColor: '#f00',
      //           borderRadius: 10,
      //           height: 10,
      //           width: 10
      //         },
      //         grade1: {
      //           color: '#3061b8',
      //           padding: 2
      //         },
      //         grade2: {
      //           color: '#f00',
      //           padding: 2
      //         },
      //         p1: {
      //           padding: 1
      //         }
      //       }
      //     },
      //     data: [
      //       {
      //         name: '江苏',
      //         value: [
      //           {name: '第一人民医院', grade: 1},
      //           {name: '第一人民医院', grade: 1},
      //           {name: '第一人民医院', grade: 2},
      //           {name: '第一人民医院', grade: 1}
      //         ]
      //       }
      //     ]
      //   }
      // ]
    };

    return option;
  }

  handleClick = params => {
    if (this.props.onClick) {
      this.props.onClick(params);
    }
  };

  shouldComponentUpdate(nextProps) {
    const {mapName} = nextProps;
    // console.log('');
    return mapName !== this.props.mapName;
  }

  componentDidUpdate() {
    console.log('update');
    let echartInstance = this.chartRef.current.getEchartsInstance();
    const {regions} = echartInstance._coordSysMgr.getCoordinateSystems()[0];
    const centers = regions.map(region => ({name:region.name, center:region.center}));
    const nodes = centers.map(p => ({
      ...p,
      center:echartInstance.convertToPixel('geo', p.center)
    }));
    this.props.renderView(nodes);
  }

  render() {
    const {config} = this.props;
    return (
      <div className="geo-c">
        <div className="test-coo"></div>
        <ReactEcharts
          ref={this.chartRef}
          option={this.getOption()}
          notMerge={true}
          lazyUpdate={false}
          style={config}
          onEvents={{
            click: this.handleClick
          }}
        />
      </div>
    );
  }
}
