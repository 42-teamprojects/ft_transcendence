#!/bin/bash

VENV_DIR=".venv"

python3 -m venv $VENV_DIR
source $VENV_DIR/bin/activate

pip3 install -r ./requirements.txt
