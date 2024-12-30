import { EventAttribute as TendermintAttribute, Event } from "@cosmjs/tendermint-rpc/build/tendermint37/responses"
import { Attribute, StringEvent } from "cosmjs-types/cosmos/base/abci/v1beta1/abci"

export const convertTendermintEvents = (events: readonly Event[]): StringEvent[] => {
    return events.map(
        (event: Event): StringEvent => ({
            type: event.type,
            attributes: event.attributes.map(
                (attribute: TendermintAttribute): Attribute => ({
                    key: attribute.key,
                    value: attribute.value,
                }),
            ),
        }),
    )
}
