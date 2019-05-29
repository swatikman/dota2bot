import * as axios from 'axios';
import { injectable, inject } from 'inversify';
import { PANDA_API } from './di/Types';

@injectable()
export class PandaApi {

    private readonly BASE_URL: string = 'https://api.pandascore.co/';
    private readonly DOTA_URL: string = this.BASE_URL + 'dota2/';
    private readonly PAGE_LIMIT: number = 100;
    private token: string;
    private options: string;

    constructor(@inject(PANDA_API.TOKEN) token: string) {
        this.token = token;

        this.options = `token=${this.token}&per_page=${this.PAGE_LIMIT}`
    }

    async getTournaments(page: number = 1) {
        return axios.default.get(`${this.DOTA_URL}tournaments?token=${this.options}&page${page}`);
    }

    async getPastTournaments(page = 1) {
        return axios.default.get(`${this.DOTA_URL}tournaments/past?${this.options}&page=${page}`);
    }

    
    async getRunningTournaments(page = 1) {
        return axios.default.get(`${this.DOTA_URL}tournaments/running?${this.options}&page=${page}`);
    }

    async getUpcomingTournaments(page = 1) {
        return axios.default.get(`${this.DOTA_URL}tournaments/upcoming?${this.options}&page=${page}`);
    }

    async getSeries(page = 1) {
        return axios.default.get(`${this.DOTA_URL}series?${this.options}&page=${page}`);
    }

    async getLeagues(page = 1) {
        return axios.default.get(`${this.DOTA_URL}leagues?${this.options}&page=${page}`);
    }

    async getTeams(page = 1) {
        return axios.default.get(`${this.DOTA_URL}teams?${this.options}&page=${page}`);
    }

    async getUpcomingMatches() {
        return axios.default.get(`${this.DOTA_URL}matches/upcoming?${this.options}&sort=id`);
    }

    async getPastMatches() {
        return axios.default.get(`${this.DOTA_URL}matches/past?${this.options}&sort=id`);
    }

    // async getTeams(page = 1) {
        // return axios.get(`${this.DOTA_URL}matches/upcoming?${this.options}`);
    // }
}
