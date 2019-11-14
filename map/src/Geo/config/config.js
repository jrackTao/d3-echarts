/**
 * 基础色
 */
const COLORS = {
  PRIMARY: '#ffffff',
  SECONDARY: '#7de5ff',
  TRANSPARENT: 'transparent',
  LIGHT_BLUE: '#1c5aa1',
  ORANGE: '#ff7f07',
  GEO_BORDER: '#3e80b1'
};

/**
 * 调色盘
 */
const PALETTES = {
  DARK: ['#3232e5', '#00a3d2', '#6332de'],
  LIGHT: ['#DA3544', '#E0D900', '#2EC199', '#2174CE'],
  RED_GREEN: ['#e3598a', '#47557c'],
  PINK_GREY_GREEN: ['#486ab5', '#3d9b82', '#814eb0', '#eb557f', '#47557c'],
  GREEN_RED_BLUE: ['#2EC199', '#DA3544', '#2433ff'],
  MAP: ['#f59300', '#61e3f7', '#3ff300', '#963720', '#faff37', '#fb92ff', '#8312ff'],
  BLUE_RED: ['#3399FF', '#FF3366'],
  BRANDS: ['#fc00a5', '#6d40ff', '#0061f4', '#009799'],
  GEO: ['#e48b3f', '#5fa7ec', '#8ee6af', '#9c7fdc', '#fb92ff'],

  DARK_BLUE_RED: ['#4aa3ff', '#ff646f'],
  DARK_RED_BLUE: ['#ff646f', '#4aa3ff'],
  GREEN_BLUE_PURPLE: ['#54ff95', '#49a2ff', '#9b59ff'],
  BLUE_GREEN_PURPLE: ['#49a2ff', '#54ff95', '#9b59ff'],
  LIGHT_GREEN: ['#35e0ac'],

  RED_SKYBLUE: ['#ee5567', '#50c1e9'],
  RED_PURPLE_BLUE: ['#ee5567', '#9b58ff', '#50c1e9'],
  LIGHT_BLUE_GREEN_PURPLE: ['#5e9ded', '#4bceae', '#af90ed'],
  LIGHT_BLUE_YELLOW_RED: ['#50c1e9', '#ffce55', '#e7586a'],
  GREEN_BLUE: ['#49cfae', '#5e9ded'],//ai
  PURPLE_BLUE_PINK: [ '#7b4ae8', '#2d88fb','#e64c7c'],//ai

  GRASS_GREEN:['#54FF95'],
  LAKE_BLUE:['#49A2FF'],
  RED_YELLOW_BLUE_GREEN:['#F54945','#DCD93E','#49A2FF','#00EDB9']

};

/**
 * 图例 ICON
 */
const LEGEND_ICONS = {
  GEO: ['circle', 'circle', 'triangle',
    'path://M0,0L.2,.2,L.8,.2L.8,.8L1,1L1,0L0,0M0,0L.2,.2,L.2,.8L.8,.8L1,1L0,1L0,0Z', 'diamond', 'pin', 'arrow']
};

export {
  COLORS,
  PALETTES,
  LEGEND_ICONS
};
