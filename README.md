# :lizard: Chamelogator
![](https://img.shields.io/badge/python-v3.9-blue) ![](https://img.shields.io/badge/platform-linux--64-lightgrey) ![Crates.io](https://img.shields.io/crates/l/ap)
___
The Chamelogator is a Dockerised Flask web application that provides the easy extraction and visualisation of data from the Chameleon Cryo-EM sample preparation instrument.  
It uses the newest versions of [Bootstrap](https://getbootstrap.com/), [Datatables](https://datatables.net/) and [Chart.js](https://www.chartjs.org/) to provide the most modern features and design.
___
##### Table of Contents  
- [Getting Started](#getting-started)  
- [Setup](#setup)
- [How it works](#how-it-works)
___
## Getting Started
The Chamelogator requires:
- Docker and docker-compose
- ...
___
## Setup  
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

___

## How it works
### Dashboard
The webapp by default loads the Dashboard landing page when heading to `https://localhost:5000`.  
The Dashboard page provides a simplied image of the Chameleon instrument along with a link to more information about it.  
As well as this, there are buttons that direct you to the other pages depending on the task.  

![image2021-9-7_10-26-15](https://user-images.githubusercontent.com/42144984/132494721-7e850234-c98b-4ec0-af6b-a8b51260c208.png)

### Data Exploration
The 'Data' page allows for the exploration of the database file provided.  
A list of checkboxes allow for the selection of specific data to explore, or the whole dataset can be loaded if none are selected.

![image2021-9-7_10-27-48](https://user-images.githubusercontent.com/42144984/132495988-9a6d3e6b-bcc1-4617-9001-f05037ec71a8.png)

When the "Generate Datatable" button is pressed, the webapp looks at the user's checkbox selection and filters the data accordingly. Then a Datatable is rendered below along with a basic chart.  

![image2021-9-7_10-28-23](https://user-images.githubusercontent.com/42144984/132496003-0108a3ad-ce77-4351-a274-2a17d5fe6018.png)

### Data Comparison
The 'Compare' page allows for the comparison of data from specific sessions of sample preparation.  
Initially, a single card is created allowing for the selection of one session's data.  

![image2021-9-7_10-29-31](https://user-images.githubusercontent.com/42144984/132496303-613029b4-d025-4a2e-b96e-16d6f1ab556d.png)

The user can also create more cards to compare multiple sessions of preparation by clicking the + button.  
Any card can also be removed by pressing the X at the top-right corner of the card.  

![image2021-9-7_10-29-56](https://user-images.githubusercontent.com/42144984/132496440-fb602b7f-fe15-4105-9f9c-c5ae2dc16fd3.png)

### Trends Analysis
The 'Trends' page allows for the plotting of two sets of data against each other. The chart can also be panned and zoomed.  
The user can also choose to save the current view as a PNG image, export the data in CSV format, and even reupload a CSV file to compare old data with new data.  

![image2021-9-7_10-30-47](https://user-images.githubusercontent.com/42144984/132496843-52f0bbff-846a-4574-90f2-156c3263803e.png)

___
## More Information

Here is more information on the Chameleon:  
[Link to SPTLabtech website](https://www.sptlabtech.com/products/chameleon/chameleon)
