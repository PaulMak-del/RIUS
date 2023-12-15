import {MaterialWait} from "./State/materialWait";
import { Client } from "pg";
import {DB} from "./DB";

export function sleep(ms: number) {
    for (let i:number = 0; i < ms * 2_000_000; i++) {

    }
}

export function operationWaiting(): void {
    for (let i = 0; i < 20; i++) {
        sleep(200)
        // @ts-ignore
        process.stdout.write('.')
    }
    console.log()
}

export function randBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export interface State {
    doCalc(): void;
}

export class Oven {
    static time: number = 0;
    static temperature: number = 100;
    static state: State = new MaterialWait();
    static showParameters() {
        console.log(`Time: ${Oven.time} | Temperature: ${Oven.temperature}`)
    }
}

async function main() {
    await DB.getInstance().init()

    while (true) {
        await Oven.state.doCalc()
        sleep(1000)
    }
}

main()

