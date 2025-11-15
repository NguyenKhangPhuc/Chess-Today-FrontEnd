import RocketIcon from '@mui/icons-material/Rocket';
import BoltIcon from '@mui/icons-material/Bolt';
import SpeedIcon from '@mui/icons-material/Speed';
import { GAME_TYPE } from '../types/enum';
import { TimeSetting } from '../types/timeSettings';
export const gamePlayManagement = [
    {
        title: 'Chess',
        imgSource: '/assets/chessboard.png',
        link: '/chess'
    },
    {
        title: 'Xiangqi',
        imgSource: '/assets/chinesechessboard.png',
        link: '/xiangqi'
    },
    {
        title: 'Go',
        imgSource: '/assets/goboard.png',
        link: '/go'
    },
    {
        title: 'Caro',
        imgSource: '/assets/caroboard.png',
        link: '/caro'
    }
]


export const timeSettings: Array<TimeSetting> = [
    {
        title: GAME_TYPE.ROCKET,
        icon: <RocketIcon sx={{ fontSize: 20 }} />,
        options: [
            {
                title: '30 seconds',
                value: 30,
            },
            {
                title: '1 minute',
                value: 60,
            },
            {
                title: '2 minutes',
                value: 120,
            },
        ]
    },
    {
        title: GAME_TYPE.BLITZ,
        icon: <BoltIcon sx={{ fontSize: 20 }} />,
        options: [
            {
                title: '3 minutes',
                value: 180,
            },
            {
                title: '5 minutes',
                value: 300,
            },
            {
                title: '7 minutes',
                value: 420,
            },
        ]
    },
    {
        title: GAME_TYPE.RAPID,
        icon: <SpeedIcon sx={{ fontSize: 20 }} />,
        options: [
            {
                title: '10 minutes',
                value: 600,
            },
            {
                title: '15 minute',
                value: 900,
            },
            {
                title: '20 minutes',
                value: 1200,
            },
        ]
    }
]
