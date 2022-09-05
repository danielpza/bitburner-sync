# bitburner-sync

Keep bitburner game files in sync with local files. Similar to https://github.com/bitburner-official/bitburner-vscode but doesn't need vscode, works from the cli.

- Supports typescript

## Installation

```
npm i -g danielpza/bitburner-sync
```

## Usage

[section in progress]

Create a `.bitburner-syncrc` file and add your AUTH_TOKEN. See bitburner-vscode for instructions on how to acquire this value. Then run `bitburner-sync`

```
# check contents of the config file
cat .bitburner-syncrc
AUTH_TOKEN: -----token-value-here-----

# run bitburner-sync
npx bitburner-sync
```

## Acknowledgment

- Most of the code is from https://github.com/bitburner-official/bitburner-vscode
