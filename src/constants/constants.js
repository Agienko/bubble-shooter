export const WIDTH = 768;
export const HEIGHT = 1024;
export const RATIO = WIDTH / HEIGHT;
export const COLORS = ['#FF4B4B', '#4BC0FF',
    '#5CFF5C',
    '#FFE14B',
    '#C44BFF'
];

export const BALL_COUNT_ROWS = 11;
export const BALL_COUNT_COLUMS = 14;
export const BALL_SIZE = WIDTH/BALL_COUNT_ROWS;
export const BALL_RADIUS = BALL_SIZE/2;
export const BALL_COLUM_STEP = Math.sqrt(BALL_SIZE**2 - (BALL_RADIUS)**2);
