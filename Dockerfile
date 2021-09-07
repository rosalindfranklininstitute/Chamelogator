# For more information, please refer to https://aka.ms/vscode-docker-python
#FROM python:3.9.5-slim-buster
FROM continuumio/anaconda3

EXPOSE 5000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

# Install pip requirements
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Install node for certain packages
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y npm
#RUN npm install npm@latest -g

COPY /webapp/static/vendor/package*.json /app/webapp/static/vendor/
WORKDIR /app/webapp/static/vendor
RUN npm install
ENV PATH /app/webapp/static/vendor/node_modules/.bin:$PATH

WORKDIR /app
COPY . /app

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-python-configure-containers
# RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
# USER appuser

# During debugging, this entry point will be overridden. For more information, please refer to https://aka.ms/vscode-docker-python-debug
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "webapp.app:app"]
