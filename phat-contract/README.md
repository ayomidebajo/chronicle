# Hello World in Phat Contract

<img align="right" width="320" src="res/Phat%20Contract_Standard%20Logo_wht_02.svg">

This contract shows the off-chain computation with native HTTP request support in Phat Contract from [Phala Network](https://phala.network/).

It receives the Ethereum accounts from users and reports the account balance by querying the Etherscan with its native HTTP request.

## Build

Setup the environment for Ink! contract compilation following the [official tutorial](https://github.com/paritytech/cargo-contract#installation)

```bash
# tested on Ubuntu 22.04
cargo contract --version
# cargo-contract-contract 3.0.1-unknown-x86_64-unknown-linux-gnu
```

then run

```bash
cargo contract build
```

## Test

To test your contract locally and see its output, run with

```bash
cargo test -- --nocapture
```
