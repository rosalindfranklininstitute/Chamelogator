# Chamelogator
![](https://img.shields.io/badge/python-v3.9-blue) ![](https://img.shields.io/badge/platform-linux--64-lightgrey) ![Crates.io](https://img.shields.io/crates/l/ap)
___
The Chamelogator is a Dockerised Flask web application that provides the easy extraction and visualisation of data from the Chameleon Cryo-EM sample preparation instrument.
It uses the newest versions of Bootstrap, Datatables and Chart.js to provide the most modern features and design.
___
## Installation/Setup  
As the webapp is Dockerised, it is relatively simple to install.

1) Clone the Git repo to the location of your choice:  
```bash
git clone https://github.com/rosalindfranklininstitute/Chamelogator.git
```
2) Edit the `webapp/config.py` file, changing the name of the sqlite3 database file from the Chameleon.
```python
DB_NAME = 'RFI_chameleon.db'
```

3) Edit the `docker-compose.yml` file, changing the location of the sqlite3 database file under the 'volumes' section.
```yaml
    volumes:
      - chameleon-db:/appuser/
      - /path/to/Chameleon/db/file:/appuser/dbs/
```

4) Build the Docker container using the `docker-compose.yml` file (the `-q` suppresses most of the messages).
```bash
docker-compose build -q
```

5) Open a browser and head to `https://localhost:5000` and see if the app is running!
