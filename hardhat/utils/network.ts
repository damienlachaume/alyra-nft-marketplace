import 'dotenv/config';

export function node_url(networkName: string): string {
  if (networkName) {
    const uri = process.env['POLYGON_NODE_URI_' + networkName.toUpperCase()];
    if (uri && uri !== '') {
      return uri;
    }
  }

  let uri = process.env.POLYGON_NODE_URI;
  if (uri) {
    uri = uri.replace('{{networkName}}', networkName);
  }
  if (!uri || uri === '') {
    if (networkName === 'localhost') {
      return 'http://localhost:8545';
    }
    // throw new Error(`environment variable "POLYGON_NODE_URI" not configured `);
    return '';
  }
  if (uri.indexOf('{{') >= 0) {
    throw new Error(
      `invalid uri or network not supported by nod eprovider : ${uri}`
    );
  }
  return uri;
}


export function accounts(networkName: string): string[] {
  return [
    process.env['POLYGON_WALLET_PRIVATE_KEY_' + networkName.toUpperCase()] ??
      '',
  ];
}
