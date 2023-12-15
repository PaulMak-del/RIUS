import {Oven, randBetween, sleep, State} from "../main";
import {Burning} from "./burning";
import {DB} from "../DB";

export class MainWarmUp implements State {
    private temp: number = 600;
    private time: number = 140;
    private db: DB = DB.getInstance();

    async doCalc() {
        console.log("-------------- Основной прогрев ------------")
        console.log('Запуск основного прогрева')

        while (Oven.temperature < this.temp) {
            Oven.showParameters()
            Oven.time += 1
            Oven.temperature += 10

            await DB.getInstance().insertIntoLog(Oven.temperature, 1, 12)

            sleep(500)
        }
        console.log('Запуск регулирования')

        while (Oven.time < this.time) {
            sleep(500)
            Oven.time += 1
            Oven.temperature += randBetween(-1, 1)

            await DB.getInstance().insertIntoLog(Oven.temperature, 1, 6)

            Oven.showParameters()
            if (Oven.temperature < this.temp - 1) {
                Oven.temperature += 1
            } else if (Oven.temperature > this.temp + 1) {
                Oven.temperature -= 1
            }
        }
        console.log('Отключение регулирования')

        console.log('Отключение основного нагрева')
        Oven.state = new Burning()
    }
}