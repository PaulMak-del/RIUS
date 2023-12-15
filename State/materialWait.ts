import {operationWaiting, State} from "../main"
import {Oven}  from "../main"
import {sleep} from '../main'
import {PrimaryWarmUp} from "./primaryWarmUp";
import {DB} from "../DB";
import {Client} from "pg";


export class MaterialWait implements State {
    private temp: number = 60;

    async doCalc() {
        console.log('----------- Ожидание материала ------------')
        console.log('Заблокировать все нагревательные элементы')
        while (Oven.temperature > this.temp) {
            Oven.showParameters()
            Oven.time += 1
            Oven.temperature -= 5.0

            await DB.getInstance().insertIntoLog(Oven.temperature, 1, 11)

            sleep(500)
        }
        console.log('Открыть камеру')
        await DB.getInstance().insertIntoLog(Oven.temperature, 1, 13)
        operationWaiting()
        console.log('Камера открыта')
        console.log('Подан сигнал запуска процесса')
        console.log('Закрыть камеру')
        operationWaiting()
        console.log('Камера закрыта')
        Oven.state = new PrimaryWarmUp()
    }
}