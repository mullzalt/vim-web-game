## Client Side Installation

### Setting up client

1.  Install the yarn packages on client side

    ```sh
    cd ./vim-web-game/client && yarn install
    ```

2.  Copy the `.env.local.example` file and rename to `.env.local` on the server folder

    ```sh
    cp .env.local.example .env.local
    ```

3.  Configure the `.env.local` file,

    Vite environments value configurations located under `.env.local` file, and use the `VITE_` prefix for accessing it.

    - **Setup the API access point**

      Insert your vim-web-game `server` URL for the value to the `VITE_SERVER_ENDPOINT`

    - **Setup the Google Oauth Client**

    Use the same value as previously mentions in [`server`](https://github.com/mullzalt/vim-web-game/client/README.md) Google Oauth client setups.

    The only difference is you insert the values to the `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET` respectively.

4.  Run the application
    ```sh
    yarn dev
    ```
