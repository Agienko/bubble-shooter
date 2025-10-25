export const WIDTH = 780;
export const HEIGHT = 1024;
export const RATIO = WIDTH / HEIGHT;
export const COLORS = [
    // '#ffffff',
    // '#00b2ff',
    // '#FFFF00',
    // '#CF51FF',
    '#00ff00',
    '#FF4B4B',
];

export const BALL_COUNT_ROWS = 11;
export const BALL_COUNT_COLUMS = 14;
export const BALL_SIZE = WIDTH/BALL_COUNT_ROWS;
export const BALL_RADIUS = BALL_SIZE/2;
export const BALL_COLUM_STEP = Math.sqrt(BALL_SIZE**2 - (BALL_RADIUS)**2);
