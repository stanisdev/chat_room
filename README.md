# chat_room
Full Messenger API supported by Node.js (Express + Socket.io) and storeges (MongoDB / PostgreSQL)

***PostgreSQL Connection setting up***
-------------

```bash
$ sudo -u postgres createdb <dbname>
```

```bash
$ sudo -u postgres psql

postgres=\# grant all privileges on database <dbname> to <username> ;
postgres=\# alter user <username> with encrypted password '<password>';
```

And for testing to able to create new db:
```bash
postgres=\# alter role <test_username> with createdb;
```