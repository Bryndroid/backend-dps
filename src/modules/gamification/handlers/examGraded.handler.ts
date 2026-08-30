import { EventPayload } from "../../../shared/interfaces/Context.js";
import { Exam } from "../../../shared/interfaces/Exam.js";


export async function rewardXpHandler(data: EventPayload<Exam>){
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(data)
}