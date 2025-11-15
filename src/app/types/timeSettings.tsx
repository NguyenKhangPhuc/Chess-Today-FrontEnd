import { JSX } from "@emotion/react/jsx-runtime";
import { GAME_TYPE } from "./enum";

export interface TimeOptions {
    title: string,
    value: number
}

export interface TimeSetting {
    title: GAME_TYPE,
    icon: JSX.Element,
    options: Array<TimeOptions>
}