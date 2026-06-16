#!/usr/bin/env bash

# ensure strict mode
set -eou pipefail

APP_DATABASE="maktaba"
TEMP_FILE=$(mktemp)
OPERATION="$1"

usage () {
    echo "Usage: $0 [OPTIONS]

    A list of options with a brief description is given below.

    -b, --build         build database schema
    -d, --drop          drop database schema
    "
}

# remove temp file on EXIT
cleanup() {
    rm -rf "$TEMP_FILE"
}

trap cleanup EXIT

# ensure correct args are passed
if [[ "$#" -gt 1 ]] || [[ "$#" -eq 0 ]]; then
    usage
    exit 1
elif [[ "$1" == "--build" ]] || [[ "$1" == "-b" ]]; then
    echo "Building $APP_DATABASE database..."

    touch "$TEMP_FILE"

    # loop through base files, appending to the complete one
    for file in ./schema/{tables.sql,stored_procedures.sql,views.sql,triggers.sql}; do
        cat $file >> "$TEMP_FILE"
    done

    # build the entire db
    mariadb -u root -p < "$TEMP_FILE" > output.tab

elif [[ "$1" == "--drop" ]] || [[ "$1" == "-d" ]]; then
    echo "Are you sure you want to drop $APP_DATABASE database. Continue? (Y/n)"
    read USER_CHOICE

    case "$USER_CHOICE" in
        "y" | "Y" | "Yes" | "yes" | "YES")
            echo "Dropping $APP_DATABASE database..."
            echo "DROP DATABASE maktaba;" > "$TEMP_FILE"
            mariadb -u root -p < "$TEMP_FILE" > output.tab
            ;;
        "n" | "N" | "No" | "no" | "NO")
            echo "Deletion of $APP_DATABASE database aborted..."
            ;;
        *)
            echo "Invalid option. try again?"
            ;;
    esac
else
    usage
    exit 1
fi

