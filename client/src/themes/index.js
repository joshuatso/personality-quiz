import { createMuiTheme } from '@material-ui/core/styles'

export const theme = createMuiTheme({
    palette: {
        primary: {
            superLight: "#a1b3cdff",
            light: "#7691b7ff",
            main: "#466085ff",
            dark: "#364a67ff",
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
            contrastText: "#ffffffff"
        }
    }
})