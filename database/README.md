## Database

this project uses mysql as a database. there are files used in building the schema:

- [tables.sql](./tables.sql)
- [views.sql](./views.sql)
- [stored-procedures.sql](./stored-procedures.sql)
- [triggers](./triggers.sql)

To setup the db easily simple use the [setup](./setup.sh) script, that will only prompt you for your password and build the db as needed.

```bash
./setup.sh --build
```

To drop the database, simple run the script to drop it with:

```bash
./setup.sh --drop
```
