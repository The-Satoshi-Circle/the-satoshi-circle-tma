import { Reactive, reactive } from "vue";
import { TonConnectUI, TonConnectUiOptions, Account } from "@tonconnect/ui";
import { SendTransactionRequest } from "@tonconnect/ui";
import { InitDataParsed, retrieveLaunchParams } from '@telegram-apps/sdk';
import { Address, beginCell, toNano, TonClient } from "@ton/ton";
import { TonConnectSender } from "../../wrappers/TonConnectSender";
import { NftCollection } from "../../wrappers/NftCollection";

interface Telegram {
  walletAccount: Account | null | undefined;
  tonConnectUI: TonConnectUI | null;
  initDataRaw: string | undefined | null;
  initData: InitDataParsed | undefined | null;
  init: () => Promise<void>;
  initTelegramData: () => void;
  initWallet: () => Promise<void>;
  initConnectWalletButton: (buttonRootId: string | null) => Promise<void>;
  sendTransaction: (transaction: SendTransactionRequest) => Promise<void>;
  mintNft: (name: string, description: string, image: string) => Promise<string>;
}

export const Telegram: Reactive<Telegram> = reactive<Telegram>({
  walletAccount: null,
  tonConnectUI: null,
  initData: null,
  initDataRaw: null,
  async init() {
    this.initTelegramData();
    this.initWallet();
  },
  initTelegramData() {
    const launchParams = retrieveLaunchParams();

    this.initDataRaw = launchParams.initDataRaw;
    this.initData = launchParams.initData;
  },
  async initWallet() {
    await TonConnectUI.getWallets();

    this.walletAccount = this.tonConnectUI?.account;
  },
  async initConnectWalletButton(buttonRootId: string | null) {
    this.tonConnectUI = new TonConnectUI({
      manifestUrl: import.meta.env.VITE_TELEGRAM_MANIFEST_URL,
      buttonRootId: buttonRootId,
    });

    await this.initWallet();

    this.tonConnectUI.uiOptions = {
      twaReturnUrl: import.meta.env.VITE_TELEGRAM_BOT_URL,
    } as TonConnectUiOptions;
  },
  async sendTransaction() {
    const body = beginCell()
      .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
      .storeStringTail("Test transaction") // write our text comment
      .endCell();

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 360,
      messages: [
        {
          address: import.meta.env.VITE_TON_CONTRACT_ADDRESS,
          amount: toNano(0.05).toString(),
          payload: body.toBoc().toString("base64"),
        },
      ],
    };

    await this.tonConnectUI?.sendTransaction(transaction);
  },
  async mintNft(name, description, image) {

    const collectionAddress = import.meta.env.VITE_TON_CONTRACT_ADDRESS;
    const address = Address.parse(collectionAddress);

    const tonClient = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC'
    });

    const nftContractProvider = tonClient.open(NftCollection.createFromAddress(address));

    const collectionData = await nftContractProvider.getCollectionData();
    
    if(this.tonConnectUI) {
      await nftContractProvider.sendMintNft(
        new TonConnectSender(this.tonConnectUI),
        toNano('0.05'),
        collectionData.nextItemIndex,
        toNano('0.05'),
        0,
        Address.parse(this.walletAccount?.address ?? ''),
        name,
        description,
        image
      )
    }

    const nftAddress = await nftContractProvider.getNftAddressByIndex(BigInt(collectionData.nextItemIndex + 1));

    return `https://getgems.io/collection/${collectionAddress}/${nftAddress.toString()}`;;
  },
});