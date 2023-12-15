import {Oven, randBetween, sleep, State} from "../main";
import {MainWarmUp} from "./mainWarmUp"
import {DB} from "../DB";

export class PrimaryWarmUp implements State {
    private temp: number = 120
    private time: number = 50
    private timeToWait: number = 500
    private product_type_id: number = 1;
    private range_id: number = 5;

    async doCalc() {
        console.log("--------------PrimaryWarmUp----------------")
        console.log("Запуск режима первичного прогрева")
        while (Oven.temperature < this.temp) {
            Oven.showParameters()
            Oven.time += 1
            Oven.temperature += 5

            await DB.getInstance().insertIntoLog(Oven.temperature, this.product_type_id, 12)

            sleep(this.timeToWait)
        }
        console.log('Запуск регулирования')

        while (Oven.time < this.time) {
            sleep(this.timeToWait)
            Oven.time += 1
            Oven.temperature += randBetween(-5, 5)

            await DB.getInstance().insertIntoLog(Oven.temperature, this.product_type_id, this.range_id)
            Oven.showParameters()
            if (Oven.temperature < this.temp - 1) {
                Oven.temperature += 1
            } else if (Oven.temperature > this.temp + 1) {
                Oven.temperature -= 1
            }
        }

        console.log('Отключение регулирования')
        console.log('Отключение первичного нагрева')
        Oven.state = new MainWarmUp()
    }
}