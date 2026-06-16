# Backend

There are some essential prerequisites before we can get the backend server going:

1. Create the `.env` file and add your desired environment variables:

```bash
$ cp .env.example .env
```

2. For a production server, you would need to build the needed files and the start the prod server by:

```bash
$ pnpm build
$ pnpm start
```

3. If you are running a development server(for modifying the source code and seeing the changes being reflected in real time), you would need to:

```bash
$ pnpm dev
```

4. If you would at anytime want to test my endpoints, this is achieved simply with jest:

```bash
$ pnpm test
```
