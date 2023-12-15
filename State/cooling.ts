import {Oven, randBetween, sleep, State} from "../main";
import {MaterialWait} from "./materialWait";
import {DB} from "../DB";

export class Cooling implements State {
    private temp: number = 60;

    async doCalc() {
        console.log("-------------- Охлаждение ------------")
        console.log('Запуск процесса охлаждения')

        while (Oven.temperature > this.temp) {
            Oven.showParameters()
            Oven.time += 1
            Oven.temperature -= 20

            await DB.getInstance().insertIntoLog(Oven.temperature, 1)

            sleep(500)
        }

        console.log('Отключение процесса охлаждения')
        Oven.state = new MaterialWait()
    }
}