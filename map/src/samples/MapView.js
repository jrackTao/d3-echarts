import React, {Component} from 'react';
import Geo from '../Geo';
import {List, Map} from 'immutable';
import ClassNames from 'classnames';
import request from 'superagent';
// import './style.less';

const URL = 'http://localhost:3000';

export default class MapView extends Component {
  static defaultProps = {
    adCode: 'china',
    renderView:() => {}
  };

  state = {
    level: 0,
    mapName: '',
    geoJson: {},
    /** 区号映射 */
    adMap: {},
    /** 区号历史 */
    adHistory: List(),
  };

  async componentDidMount() {
    const {adCode} = this.props;
    await this.getGeoJson(adCode);
  }

  /**
   * Get current administrative division.
   *
   * @param adcode
   * @returns {Promise<{}>}
   */
  getCurrentDivision = async adcode => {
    try {
      return await this.getArea(adcode);
    } catch (e) {
      return {};
    }
  };

  getArea = async adcode => {
    const {data} = (await request.get(URL + '/division/' + adcode)).body;
    return data || {name: '', level: 1};
  };

  /**
   * Get geo json && Set to state
   *
   * @param adcode
   //  * @param mapName
   * @param isBack
   * @returns {Promise<void>}
   */
  getGeoJson = async(adcode, isBack = false) => {
    let mapName, level;

    if (adcode === 'china') {
      mapName = 'china';
      level = 'country';
    } else {
      const division = await this.getCurrentDivision(adcode);
      mapName = division.name;
      level = division.level;
    }

    const res = (await request.get(URL + '/geo-json/' + adcode)).body;
    const {data} = res;
    if (!data.features || data.features.length === 0) return;

    if (this.props.onUpdate) {
      this.props.onUpdate(adcode);
    }

    this.setState({
      geoJson: data,
      mapName,
      level,
      adHistory: this.state.adHistory.push({id: adcode, name: mapName, level})
    });
  };

  /**
   * Click handler
   */
  handleClick = async params => {
    const {adHistory} = this.state;
    // e.target is not a region, goback
    if (!params.region) {
      if (params.name) {
        params.event.event.stopPropagation();
        return;
      }
      if (adHistory.size > 0) {
        this.gobackPreLevel();
        return;
      }
    }
    // cancel bubble
    params.event.event.stopPropagation();
    const {name, id} = params.region;
    // skip when last level
    if (adHistory.last().id !== id) {
      await this.getGeoJson(id, name);
    }
  };

  /**
   * Goto last map if has in history
   */
  gobackPreLevel = async() => {
    const {adHistory} = this.state;
    if (adHistory.size < 2) {
      return;
    }
    const newHistory = adHistory.pop();
    const {id, name, level} = newHistory.last();

    if (!id || !name) {
      return;
    }
    await this.getGeoJson(id, false);
    this.setState({
      level,
      adHistory: newHistory
    });
  };

  render() {
    const {mapName, geoJson, level, legendMap} = this.state;
    const {
      className,
      style,
      children,
      data,
      renderView,
      config,
    } = this.props;

    const displayRatio = 1;

    return (
      <div
        className={ClassNames('ui-map-view', className)}
        style={style}
        onClick={this.handleClick}
      >
        {children}
        <Geo
          config={config}
          renderView={renderView}
          mapName={mapName}
          geoJson={geoJson}
          level={level}
          onClick={this.handleClick}
        />
      </div>
    );
  }
}
