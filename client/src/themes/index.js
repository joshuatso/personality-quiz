import { createMuiTheme } from '@material-ui/core/styles'

export const theme = createMuiTheme({
    palette: {
        primary: {
            background: "#f7edf7",
            superLight: "#df9fdf",
            light: "#bf40bf",
            main: "#642164ff",
            dark: "#391339",
            contrastText: "#ffffffff"
        },
        info: {
            light: "#a4eee1ff",
            main: "#4bdec4ff",
            dark: "#22b99eff",
            contrastText: "#ffffffff"
        },
        secondary: {
            light: "ffa7a9ff",
            main: "#ff777bff",
            dark: "#de585cff",
            contrastText: "#efefef"
        },
        tertiary: {
            main: "#facf67ff"
        }
    },
    shape: {
        borderRadius: 8
    },
    typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
    }
})