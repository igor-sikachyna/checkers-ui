import { QueryClient, StargateClient, StargateClientOptions } from "@cosmjs/stargate"
import { BroadcastTxSyncResponse, Tendermint37Client } from "@cosmjs/tendermint-rpc"
import { CheckersExtension, setupCheckersExtension } from "./modules/checkers/queries"

export class CheckersStargateClient extends StargateClient {
    public readonly checkersQueryClient: CheckersExtension | undefined

    public static async connect(
        endpoint: string,
        options?: StargateClientOptions,
    ): Promise<CheckersStargateClient> {
        const tmClient = await Tendermint37Client.connect(endpoint)
        return new CheckersStargateClient(tmClient, options)
    }

    protected constructor(tmClient: Tendermint37Client | undefined, options: StargateClientOptions = {}) {
        super(tmClient, options)
        if (tmClient) {
            this.checkersQueryClient = QueryClient.withExtensions(tmClient, setupCheckersExtension)
        }
    }

    public async tmBroadcastTxSync(tx: Uint8Array): Promise<BroadcastTxSyncResponse> {
        return <Promise<BroadcastTxSyncResponse>>this.forceGetCometClient().broadcastTxSync({ tx })
    }
}
