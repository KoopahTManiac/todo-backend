
export const inOneYear = (date: Date): Date => {
    const oneYear = 1000 * 60 * 60 * 24 * 365;
    return new Date(date.getTime() + oneYear);
}

export const inOneWeek = (date: Date): Date => {
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return new Date(date.getTime() + oneWeek);
}

export const inOneDay = (date: Date): Date => {
    const oneDay = 1000 * 60 * 60 * 24;
    return new Date(date.getTime() + oneDay);
}

export const inOneHour = (date: Date): Date => {
    const oneHour = 1000 * 60 * 60;
    return new Date(date.getTime() + oneHour);
}

export const inOneMinute = (date: Date): Date => {
    const oneMinute = 1000 * 60;
    return new Date(date.getTime() + oneMinute);
}

export const inXHouers = (date: Date, x: number): Date => {
    const oneHour = 1000 * 60 * 60;
    return new Date(date.getTime() + oneHour * x);
}

export const inXDays = (date: Date, x: number): Date => {
    const oneDay = 1000 * 60 * 60 * 24;
    return new Date(date.getTime() + oneDay * x);
}

export const inXWeeks = (date: Date, x: number): Date => {
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return new Date(date.getTime() + oneWeek * x);
}

export const inXMonths = (date: Date, x: number): Date => {
    const oneMonth = 1000 * 60 * 60 * 24 * 30;
    return new Date(date.getTime() + oneMonth * x);
}

export const inXYears = (date: Date, x: number): Date => {
    const oneYear = 1000 * 60 * 60 * 24 * 365;
    return new Date(date.getTime() + oneYear * x);
}