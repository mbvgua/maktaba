## Database

this project uses mysql as a database. there are files used in building the schema:

- [tables.sql](./tables.sql)
- [views.sql](./views.sql)
- [stored-procedures.sql](./stored-procedures.sql)
- [triggers](./triggers.sql)

To setup the db easily simple use the [setup](./setup) script, that will only prompt you for your password and build the db as needed.

```bash
./build_db
```

if need be to quickly drop the database, simple run the script to drop it with:

```bash
./drop_db
```



