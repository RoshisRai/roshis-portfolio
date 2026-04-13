import localFont from 'next/font/local'

export const fontSans = localFont({
    src: [
        {
            path: '../../public/fonts/InterVariable.woff2',
            style: 'normal',
        },
    ],
    variable: '--font-sans',
    display: 'swap',
    preload: true,
})

export const fontDisplay = localFont({
    src: [
        {
            path: '../../public/fonts/SatoshiVariable.woff2',
            style: 'normal',
        },
    ],
    variable: '--font-display',
    display: 'swap',
    preload: true,
})

export const fontMono = localFont({
    src: [
        {
            path: '../../public/fonts/JetBrainsMono.woff2',
            style: 'normal',
        },
    ],
    variable: '--font-mono',
    display: 'swap',
    preload: false, //Only needed for code blocks, so we can afford to load it later
})