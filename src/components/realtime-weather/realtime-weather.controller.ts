import * as cheerio from 'cheerio';
import * as axios from 'axios';
import { Application, NextFunction, Request, Response } from 'express';
// import {
//     ReasonPhrases,
//     StatusCodes,
// } from 'http-status-codes';
import * as responsehandler from '../../lib/response-handler';
// import ApiError from '../../abstractions/ApiError';
import BaseApi from '../BaseApi';
import { RWRainData } from './realtime-weather.types';

/**
 * Status controller
 */
export default class RealtimeWeatherController extends BaseApi {

    constructor(express: Application) {
        super();
        this.register(express);
    }

    public register(express: Application): void {
        express.use('/api/realtime-weather', this.router);
        this.router.get('/rain', this.getRWRain);
    }

    public getRWRain(req: Request, res: Response, next: NextFunction): void {
        try {
            axios.default.get('https://www.chguadalquivir.es/saih/LluviaTabla.aspx').then((resp) => {
                const $ = cheerio.load(resp.data);
                const response: RWRainData = [];
            
                const lista = $('#ContentPlaceHolder1_GridLluviaTiempoReal tbody').children();
            
                lista.each((i, elem) => {
                    if (i === 0) {
                        // No queremos la cabecera de la tabla
                        return;
                    }
                    const fila = $(elem, 'tr').children();
                    const obj = {
                        nombrePunto: fila.eq(0).text(),
                        horaActual: fila.eq(1).text(),
                        ultimas12horas: fila.eq(2).text(),
                        acumuladoHoy: fila.eq(3).text(),
                        acumuladoAyer: fila.eq(4).text(),
                        unidad: fila.eq(5).text(),
                    };
                    response.push(obj);
                });

                res.locals.data = response;
                responsehandler.send(res);
            });
        } catch (err) {
            next(err);
        }
    }
}
