#! python
import argparse
import json
import logging
import os
import subprocess
import sys
from pathlib import Path
from pprint import pprint

from cookiecutter.main import cookiecutter
from cookiecutter.prompt import read_user_yes_no


TEMPLATE_URI = 'gh:janluke/cookiecutter-react-component'
CONFIG_FILENAME = 'create-component.json'

# Command line interface
parser = argparse.ArgumentParser()
# Template args
# TODO: if I can read cookiecutter.json, I can generate the parser for the specific template
parser.add_argument('component_name')
parser.add_argument('component_type', nargs="?", choices=["function", "class"], default="function")
parser.add_argument('-s', '--style-type',
                    choices=['css', 'scss', 'module.css', 'module.scss'], default='scss')
parser.add_argument('-t', '--include-test-file',
                    choices=['y', 'n'], default='n')
parser.add_argument('-i', '--include-index-file',
                    choices=['y', 'n'], default='y')
parser.add_argument('-p', '--use-proptypes', choices=['y', 'n'], default='y')
# Cookiecutter CLI args
parser.add_argument('-o', '--output-dir', default='src/components')
parser.add_argument('-f', '--overwrite-if-exists', action='store_true')
parser.add_argument('--skip-if-file-exists', action='store_true')
parser.add_argument('-v', '--verbose', action='store_true')

# Load config file
config_path = Path(os.curdir, 'create-component.json')
config = {}
config_path = Path(os.curdir, CONFIG_FILENAME)
if config_path.exists():
    print('Loading local configuration file...')
    with config_path.open() as f:
        config = json.load(f)
else:
    print('No local configuration found')

# Parse CLI args
parser.set_defaults(**config)
args = parser.parse_args()

# Split template args from args to pass to cookiecutter CLI
CLI_ARG_NAMES = ['output_dir', 'overwrite_if_exists',
                 'skip_if_file_exists', 'verbose']
TEMPLATE_ARG_NAMES = list(set(vars(args)) - set(CLI_ARG_NAMES))
cli_args = {attr: getattr(args, attr) for attr in CLI_ARG_NAMES}
template_args = {attr: getattr(args, attr) for attr in TEMPLATE_ARG_NAMES}

# Print args 
def print_args_list(name, argdict, end='\n'):
    print(f'{name}:')
    for key, value in argdict.items():
        print(f'  {key}: {value}')
    print('', end=end)

print('')
print_args_list('Cookiecutter CLI args', cli_args)
print_args_list('Template args', template_args)

# Ask for confirmation
def ask_yes_no_question(question, default=None):
    if default is True:
        answers = '([y]/n)'
    elif default is False:
        answers = '(y/[n])'
    elif default is None:
        answers = '(y/n)'
    else:
        raise TypeError('default')

    prompt = f'{question} {answers}: '

    while True:
        answer = input(prompt).strip()
        if not answer and default is not None:
            return default
        if answer not in 'yn':
            print('Please, answer y or n')
        else:
            return answer == 'y'

confirmed = ask_yes_no_question('Confirm?', default=True)
if not confirmed:
    print('Creation aborted. Bye!')
    sys.exit(0)

# Setup cookiecutter logging verbosity and run it
verbose = cli_args.pop('verbose')   # verbose is not an argument of cookiecutter()
logging.basicConfig(level=logging.DEBUG if verbose else logging.INFO)
try:
    cookiecutter(
        TEMPLATE_URI,
        no_input=True,
        **cli_args, 
        extra_context=template_args
    )
    print('Done!')
except Exception as exc:
    print(exc)
