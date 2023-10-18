import { NextRequest, NextResponse } from "next/server";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

// AccountFactory Conract Address: 0xa702d5ee92f01e64072dd07150c6151ae5f26339
// Account Address: 0x3DBc4f1c017796d641B813853a27E14b53a300e9
// ThirdWeb secretKey: NHCAGhn5TowGCh4c1PCvtgCtcuX1CEtM_4p4XKbsyZ2-CLCsFgbhaZo_gWs8XtgEkZPoAZKTfh8z3qzdJb9pzg


// type deployCollectionParams = {
//   name: string;
//   description: string;
//   image: string;
//   price: number;
//   hasQuantity: boolean;
//   quantity: number;
//   royaltyBps: number;
//   mintEnabled: boolean;
//   walletAddress: string;
//   maxMintPerWallet: number;
// };
export async function POST(request: Request) {
  try {
    const json = await request.json();

    const {
      name,
      primary_sale_recipient,
      voting_token_address
    } = json

    const config = {
      ThirdWebSecretKey: 'NHCAGhn5TowGCh4c1PCvtgCtcuX1CEtM_4p4XKbsyZ2-CLCsFgbhaZo_gWs8XtgEkZPoAZKTfh8z3qzdJb9pzg',
      privateKey: '94162bd0fceaa32f982129404f23be2c7456247ae689787bcd214944c4a4d831',
    }
    const sdk = ThirdwebSDK.fromPrivateKey(config.privateKey, "polygon", {
      secretKey: config.ThirdWebSecretKey,
    });

    const txResult = await sdk.deployer.deployBuiltInContract("nft-collection", {
      name,
      primary_sale_recipient,
      voting_token_address, // Only used for Vote
    });

    let json_response = {
      status: "success",
      data: {
        contract_address: txResult
      },
    };
    return new NextResponse(JSON.stringify(json_response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      let error_response = {
        status: "fail",
        message: "Feedback with title already exists",
      };
      return new NextResponse(JSON.stringify(error_response), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    let error_response = {
      status: "error",
      message: error.message,
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
