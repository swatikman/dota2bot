import * as jwt from 'jsonwebtoken';
import Config = require('./Config');

export const formatDate = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const minutes = this.addZeroToStartIfNeeded(date.getMinutes());
    const hours = this.addZeroToStartIfNeeded(date.getHours());
    const day = this.addZeroToStartIfNeeded(date.getDate());
    return `${months[date.getMonth()]} ${day}, ${hours}:${minutes}`;
}

export const addZeroToStartIfNeeded = (number) => {
    return (number < 10 ? '0' : '') + number;
}

export const getLimitAndOffset = (query: any) => {
    return { limit: query.limit, offset: query.offset };
}

export const generateToken = (userId: number) => {
    const token = jwt.sign({
        userId: userId
    }, Config.PRIVATE_KEY);
    return token;
}
