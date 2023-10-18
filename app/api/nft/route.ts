import { NextRequest, NextResponse } from "next/server";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

// AccountFactory Conract Address: 0xa702d5ee92f01e64072dd07150c6151ae5f26339
// Account Address: 0x3DBc4f1c017796d641B813853a27E14b53a300e9
// ThirdWeb secretKey: NHCAGhn5TowGCh4c1PCvtgCtcuX1CEtM_4p4XKbsyZ2-CLCsFgbhaZo_gWs8XtgEkZPoAZKTfh8z3qzdJb9pzg

// call /api/wallet/new 從server端建立一個organization錢包, 並且把錢包地址綁在organization db 紀錄上. 以後發的nft 都會用這個org 錢包地址

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const {
      contractAddress,
      metadataUrl,
      toAddress
    } = json
    const config = {
      ThirdWebSecretKey: 'NHCAGhn5TowGCh4c1PCvtgCtcuX1CEtM_4p4XKbsyZ2-CLCsFgbhaZo_gWs8XtgEkZPoAZKTfh8z3qzdJb9pzg',
      privateKey: '94162bd0fceaa32f982129404f23be2c7456247ae689787bcd214944c4a4d831',
    }
    const sdk = ThirdwebSDK.fromPrivateKey(config.privateKey, "polygon", {
      secretKey: config.ThirdWebSecretKey,
    });

    
    const contract = await sdk.getContract(contractAddress);
    
    const address = toAddress; // address of the wallet you want to claim the NFTs
    // const quantity = 1; // how many unique NFTs you want to claim

    const tx = await contract.erc721.mintTo(address, metadataUrl);
    const claimedNFT = await tx.data(); // (optional) get the claimed NFT metadata

    let json_response = {
      status: "success",
      data: {
        ...claimedNFT
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
