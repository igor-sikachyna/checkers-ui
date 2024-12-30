import { Attribute, Event } from "@cosmjs/stargate/build/events"
import { GamePiece, Pos } from "./player"
import { DeliverTxResponse } from "@cosmjs/stargate"

export type GameCreatedEvent = Event

export const getCreateGameEvent = (response: DeliverTxResponse): GameCreatedEvent | undefined =>
    response.events.find((event: Event) => event.type === "new-game-created")

export const getCreatedGameId = (createdGameEvent: GameCreatedEvent): string =>
    createdGameEvent.attributes.find((attribute: Attribute) => attribute.key == "game-index")!.value

export type MovePlayedEvent = Event

export const getMovePlayedEvents = (response: DeliverTxResponse): MovePlayedEvent[] => {
    const result: MovePlayedEvent[] = [];
    for (let e of response.events) {
        if (e.type === "move-played") {
            result.push(e);
        }
    }
    return result;
}

export const getCapturedPos = (movePlayedEvent: MovePlayedEvent): Pos | undefined => {
    const x: number = parseInt(
        movePlayedEvent.attributes.find((attribute: Attribute) => attribute.key == "captured-x")!.value,
        10,
    )
    const y = parseInt(
        movePlayedEvent.attributes.find((attribute: Attribute) => attribute.key == "captured-y")!.value,
        10,
    )
    if (isNaN(x) || isNaN(y)) return undefined
    return { x, y }
}

export const getWinner = (movePlayedEvent: MovePlayedEvent): GamePiece | undefined =>
    movePlayedEvent.attributes.find((attribute: Attribute) => attribute.key == "winner")!.value as
        | GamePiece
        | undefined
