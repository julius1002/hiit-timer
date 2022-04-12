import * as R from 'ramda';

const secondsToDhms = (sec: any) => {

    const secondsOfADay = R.multiply(3600)(24)

    const days = (seconds: number) => seconds / secondsOfADay
    const hours = (seconds: number) => seconds % secondsOfADay / 3600
    const minutes = (seconds: number) => seconds % 3600 / 60
    const secs = (seconds: number) => seconds % 60

    const dDisplay = (d: number) => d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    const hDisplay = (h: number) => h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    const mDisplay = (m: number) => m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    const sDisplay = (s: number) => s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

    const seconds = R.map(Number, [sec])[0]

    const d = R.pipe(days, Math.floor, dDisplay)(seconds)
    const h = R.pipe(hours, Math.floor, hDisplay)(seconds)
    const m = R.pipe(minutes, Math.floor, mDisplay)(seconds)
    const s = R.pipe(secs, Math.floor, sDisplay)(seconds)

    return R.reduce((a: string, b: string) => a + b, "", [d, h, m, s]);
}

export { secondsToDhms }