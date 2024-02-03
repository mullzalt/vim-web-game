## Sever Side Installation

### Setting up server

1. Install the yarn packages on server side

   ```sh
   cd ./vim-web-game/server && yarn install
   ```

2. Copy the `.env.example` file and rename to `.env` on the server folder

   ```sh
   cp .env.example .env
   ```

3. Configure the `.env` file,

   - **Setup the `NODE_ENV` value (optional)**

     The default value is `development`

   - **Setup the database connection**

     Change to `DATABASE_URL` value to your Postgresql database,
     see more detail on how to connect Postgresql to Prisma [here](https://www.prisma.io/docs/orm/overview/databases/postgresql)

   - **Setup the Google Oauth Client**

     Visit the [Google Cloud](https://console.cloud.google.com/) and use an existing project or create a new project,
     see [Google Cloud API authentication documentation](https://developers.google.com/workspace/guides/auth-overview) for more detailed guide.

   - **Setup the RSA256 key for the JWT**

     For more secure secret, the Json Web Token key use the RSA key and encoded with Base64.

     1. Generate RSA Key for the `JWT_ACCESS_TOKEN_PRIVATE_KEY` and `JWT_ACCESS_TOKEN_PUBLIC_KEY`, you could generate the key [here](https://cryptotools.net/rsagen). Use `4096` Key Length
     2. Encode both Private and Public key with Base64 format, it could be encodes [here](https://www.base64encode.org/), use `ASCII` destination character set.
     3. Insert the encoded values to the `JWT_ACCESS_TOKEN_PRIVATE_KEY` and `JWT_ACCESS_TOKEN_PUBLIC_KEY` respectively.
     4. Repeat the steps above for the `JWT_REFRESH_TOKEN_PRIVATE_KEY` and `JWT_REFRESH_TOKEN_PUBLIC_KEY`

   - **Setup the Origin**

     Insert your vim-web-game `client` URL for the value.

4. Configure the application `config` **(not recommended)**

   The API configurations located under `server/config` folder, **make sure you don't change the values of `custom-environment-variables.ts`**, it's read the values of the `.env` to work alongside with `config.js`.
   However you could change the values of the `default.ts` file to change the expire time of your tokens.

5. Run the application
   ```sh
   yarn dev
   ```
