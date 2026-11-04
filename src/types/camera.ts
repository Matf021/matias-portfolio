
export type ViewportInsets = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};

export type ScreenRect = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export const EMPTY_VIEWPORT_INSETS: ViewportInsets = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};
