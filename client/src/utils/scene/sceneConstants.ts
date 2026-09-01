// Fixed layout for the 3D board: a static top-down-ish camera looking at the
// origin, with the table lying flat on the X/Z plane. Larger Z is closer to
// the camera (appears lower on screen), which is what puts "my" hand and the
// action buttons near the bottom of the view and the pile in the middle.

export const CAMERA_POSITION: [number, number, number] = [0, 10, 6];
export const CAMERA_FOV = 40;

export const BOARD_SIZE = 12;
export const BOARD_COLOR = "#2f5d3a";

export const CARD_WIDTH = 1.4;
export const CARD_DEPTH = 2;
export const CARD_THICKNESS = 0.06;
export const CARD_COLOR = "#f5f5f0";
export const CARD_DISABLED_COLOR = "#9a9a94";

export const PILE_Z = 0;
export const HAND_Z = 4;
export const HAND_CARD_SPACING = CARD_WIDTH * 0.65;

export const BUTTON_Z = 5.6;
export const BUTTON_WIDTH = 1.8;
export const BUTTON_DEPTH = 0.8;
export const BUTTON_HEIGHT = 0.3;
export const BUTTON_COLOR = "#4a7fd6";
export const BUTTON_DISABLED_COLOR = "#5a5a58";
export const BUTTON_GAP = 2.1;
