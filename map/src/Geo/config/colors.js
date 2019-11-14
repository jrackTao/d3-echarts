import generate from 'string-to-color';
import Color from 'color';
// import {starPath} from './path';

export const DEFAULT_COLORS = {
  '综合医院': '#ed332b',
  '妇幼保健院': '#fe8100',
  '社区卫生服务中心': '#ffce54',
  '乡镇卫生院': '#fdfa03',
  '疗养院': '#a0d468',
  '综合门诊部': '#54ff94',
  '诊所、卫生站': '#35dfac',
  '村卫生所': '#7de5ff',
  '急救中心': '#1ca7ff',
  '临床检验中心': '#3232e5',
  '专科疾病防治院': '#6332de',
  '护理院': '#9b58ff',
  '医学检验实验室': '#ac92ec',
  '其他诊疗机构': '#ec87c0',

  // health-100
  '美年': '#ed332b',
  '奥亚': '#fe8100',
  '美恒': '#ffce54',
  '美兆': '#a0d468',
  '慈铭': '#ec87c0',

  '其他': '#d5d5d5',

  '三甲医院': '#f66400',
  '三级医院': '#47ca69',
  '二级医院': '#3172cf',
  '基层机构': '#6534d1',

  // '诊断中心': {
  //   symbol:starPath,
  //   itemStyle:{
  //     color:'#85e4f7',
  //   }
  // }

};

export default {
  /**
   * 机构标签颜色生成
   *
   * @param key
   * @returns {*}
   */
  orgTag: (key) => {
    if (DEFAULT_COLORS.hasOwnProperty(key)) return DEFAULT_COLORS[key];

    let color = Color(generate('orgTag:' + key));
    const luminosity = color.luminosity();
    if (luminosity <= 0.3) {
      color = color.lighten(0.5 - luminosity);
    }
    return color.toString();
  },
  DEFAULT_COLORS,
};
