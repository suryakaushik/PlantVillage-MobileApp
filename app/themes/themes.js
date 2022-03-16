import { DefaultTheme, DarkTheme } from '@react-navigation/native';
export const darkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        PRIMARY_BACKGROUND_COLOR: '#353c51',
        PRIMARY_TEXT_COLOR: '#767d92',
        SECONDARY_TEXT_COLOR: '#ffffff',
        PRIMARY_BUTTON_COLOR: '#152642',
        SECONDARY_BUTTON_COLOR: '#506680'
    }
}
export const lightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        PRIMARY_BACKGROUND_COLOR: '#ffefd5',
        PRIMARY_TEXT_COLOR: '#DB7093',
        SECONDARY_TEXT_COLOR: '#333333',
        PRIMARY_BUTTON_COLOR: '#b9d6f3',
        SECONDARY_BUTTON_COLOR: '#a1c9f1'
    }
}
export const defTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        border: "transparent",
    }
}
export const MyTheme = {
    dark: false,
    colors: {
      primary: 'rgb(255, 45, 85)',
      background: 'rgb(242, 242, 242)',
      card: 'rgb(255, 255, 255)',
      text: 'rgb(28, 28, 30)',
      border: 'rgb(199, 199, 204)',
      notification: 'rgb(255, 69, 58)',
    },
  };