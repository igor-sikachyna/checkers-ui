import { StargateClientOptions } from "@cosmjs/stargate"
import { Tendermint37Client } from "@cosmjs/tendermint-rpc"
import { StringEvent } from "cosmjs-types/cosmos/base/abci/v1beta1/abci"
import { convertTendermintEvents } from "./events"
import { CheckersStargateClient } from "../checkers_stargateclient"
import { BlockResultsResponse } from "@cosmjs/tendermint-rpc/build/tendermint37"

export class IndexerStargateClient extends CheckersStargateClient {
    private readonly myTmClient: Tendermint37Client

    public static async connect(
        endpoint: string,
        options: StargateClientOptions = {},
    ): Promise<IndexerStargateClient> {
        const tmClient = await Tendermint37Client.connect(endpoint)
        return new IndexerStargateClient(tmClient, options)
    }

    protected constructor(tmClient: Tendermint37Client, options: StargateClientOptions) {
        super(tmClient, options)
        this.myTmClient = tmClient
    }

    public async getEndBlockEvents(height: number): Promise<StringEvent[]> {
        const results: BlockResultsResponse = await this.myTmClient.blockResults(height)
        return convertTendermintEvents(results.endBlockEvents)
    }
}
