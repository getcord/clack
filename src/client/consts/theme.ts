import { Colors } from 'src/client/consts/Colors';

export type ClackTheme = 'default' | 'winter' | 'spring';

export const themeOptions: { [k in ClackTheme]: string } = {
  default: '👖',
  winter: '❄️',
  spring: '🌼',
};

const peach = '#EF927B';
const light_light_green = '#EEF9EE';
const dark_green = '#42654D';
const dark_dark_green = '#0C4532';

export const theme: Record<ClackTheme, object> = {
  default: {
    topbar: {
      bg: Colors.purple_dark,
    },
    sidebar: {
      bg: Colors.purple_dark,
    },
    channel: {
      active: { bg: Colors.blue_active },
      bg: Colors.purple,
      hover: { bg: Colors.purple_hover },
      add: { bg: Colors.purple },
    },
    searchbar: {
      button: { fg: 'white' },
      bg: '#5C3D5E',
    },
    bordercolor: Colors.purple_border,
    chat: {
      border: Colors.gray_light,
      details: { bg: 'white', header: 'black' },
    },
    cord: {
      colorbase: 'white',
    },
  },
  winter: {
    topbar: {
      bg: '#577899',
    },
    sidebar: {
      bg: '#4B6285',
    },
    channel: {
      active: { bg: '#577899' },
      bg: '#4B6285',
      hover: { bg: '#A9C2D6' },
      add: { bg: '#4B6285' },
    },
    searchbar: {
      button: { fg: 'white' },
      bg: '#87A2BD',
    },
    bordercolor: '#4B6285',
    chat: {
      border: Colors.gray_light,
      details: { bg: '#D3E2EB', header: '#4B6285' },
    },
    cord: {
      colorbase: '#EAF3F9',
    },
  },
  spring: {
    topbar: {
      bg: dark_dark_green,
    },
    sidebar: {
      bg: dark_green,
    },
    channel: {
      active: { bg: dark_dark_green },
      bg: dark_green,
      hover: { bg: peach },
      add: { bg: dark_green },
    },
    searchbar: {
      button: { fg: 'white' },
      bg: peach,
    },
    bordercolor: dark_green,
    chat: {
      border: dark_green,
      details: { bg: light_light_green, header: dark_green },
    },
    cord: {
      colorbase: light_light_green,
    },
  },
};
