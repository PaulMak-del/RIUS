import {Oven, randBetween, sleep, State} from "../main";
import {Cooling} from "./cooling";
import {DB} from "../DB";

export class Burning implements State {
    private temp: number = 970;
    private time: number = 190;

    async doCalc() {
        console.log("-------------- Обжиг ------------")
        console.log('Запуск процесса обжига')

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

            await DB.getInstance().insertIntoLog(Oven.temperature, 1, 7)

            Oven.showParameters()
            if (Oven.temperature < this.temp - 1) {
                Oven.temperature += 1
            } else if (Oven.temperature > this.temp + 1) {
                Oven.temperature -= 1
            }
        }

        console.log('Отключение регулирования')
        console.log('Отключение процесса обжига')
        Oven.state = new Cooling()
    }
}