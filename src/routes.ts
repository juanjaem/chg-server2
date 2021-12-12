import * as express from 'express';
import SystemStatusController from './components/system-status/system-status.controller';
import RealtimeWeatherController from './components/realtime-weather/realtime-weather.controller';

export default function registerRoutes(app: express.Application): void {
    new SystemStatusController(app);
    new RealtimeWeatherController(app);
}
