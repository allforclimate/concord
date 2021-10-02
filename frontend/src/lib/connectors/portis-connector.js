import { AbstractConnector } from '@web3-react/abstract-connector';

const chainIdToNetwork = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  5: 'goerli',
  42: 'kovan',
  100: 'xdai',
  30: 'orchid',
  31: 'orchidTestnet',
  99: 'core',
  77: 'sokol',
  61: 'classic',
  8: 'ubiq',
  108: 'thundercore',
  18: 'thundercoreTestnet',
  163: 'lightstreams',
  122: 'fuse',
  137: 'matic',
  80001: 'maticMumbai',
};

export class PortisConnector extends AbstractConnector {
  constructor({ dAppId, networks, config = {} }) {
    const chainIds = networks.map((n) =>
      typeof n === 'number' ? n : Number(n.chainId)
    );
    super({ supportedChainIds: chainIds });

    this.dAppId = dAppId;
    this.networks = networks;
    this.config = config;

    this.handleOnLogout = this.handleOnLogout.bind(this);
    this.handleOnActiveWalletChanged =
      this.handleOnActiveWalletChanged.bind(this);
    this.handleOnError = this.handleOnError.bind(this);
  }

  handleOnLogout() {
    this.emitDeactivate();
  }

  handleOnActiveWalletChanged(account) {
    this.emitUpdate({ account });
  }

  handleOnError(error) {
    this.emitError(error);
  }

  async activate() {
    if (!this.portis) {
      const Portis = await import('@portis/web3').then((m) => m?.default ?? m);
      this.portis = new Portis(
        this.dAppId,
        typeof this.networks[0] === 'number'
          ? chainIdToNetwork[this.networks[0]]
          : this.networks[0],
        this.config
      );
    }

    this.portis.onLogout(this.handleOnLogout);
    this.portis.onActiveWalletChanged(this.handleOnActiveWalletChanged);
    this.portis.onError(this.handleOnError);

    const account = await this.portis.provider
      .enable()
      .then((accounts) => accounts[0]);

    return { provider: this.portis.provider, account };
  }

  async showPortis() {
    return this.portis.showPortis();
  }

  async getProvider() {
    return this.portis.provider;
  }

  async getChainId() {
    return this.portis.provider.send('eth_chainId');
  }

  async getAccount() {
    return this.portis.provider
      .send('eth_accounts')
      .then((accounts) => accounts[0]);
  }

  deactivate() {
    this.portis.onLogout(() => {});
    this.portis.onActiveWalletChanged(() => {});
    this.portis.onError(() => {});
  }

  async changeNetwork(newNetwork, isGasRelayEnabled) {
    if (typeof newNetwork === 'number') {
      this.portis.changeNetwork(
        chainIdToNetwork[newNetwork],
        isGasRelayEnabled
      );
      this.emitUpdate({ chainId: newNetwork });
    } else {
      this.portis.changeNetwork(newNetwork, isGasRelayEnabled);
      this.emitUpdate({ chainId: Number(newNetwork.chainId) });
    }
  }

  async close() {
    await this.portis.logout();
    this.emitDeactivate();
  }
}

export default PortisConnector;
