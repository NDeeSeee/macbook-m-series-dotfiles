# Cursor Pyright Changelog

## 1.0.3
* Automatically set `python.languageServer` to 'None', if it was configured with something else
* Change default type check mode from 'off' to 'basic' for minimal type checking by default
* Add a warning if the `diagnosticSeverityOverrides` are set in conjunction with a `pyproject.toml` file or `pyrightconfig.json` file

## 1.0.2
* Remove dependency on Pylance
* Add a notification if file enumeration takes too long

## 1.0.1
* Added option to import settings from Pylance

## 1.0.0

* Bug fixes and improvements

## v0.0.5

* Added `cursorpyright.nodeMaxOldSpaceSize` setting. Values:
  * **> 0** – explicit heap size in MB
  * **0**   – disable automatic `--max-old-space-size` insertion
  * **-1**  – *adaptive* (default): the extension selects a size ≈ half your physical RAM, capped at **16 GB** (with 4 GB for 8-16 GB machines and 3 GB for smaller ones).
* The extension still skips adding the flag when you manually specify `--max-old-space-size` in `cursorpyright.nodeArguments`.

## v0.0.4

* Suppressed the error message for when Jupyter notebooks could not be parsed and when indexing takes longer than 10 seconds

## v0.0.3

* Added settings to customize the node arguments (`cursorpyright.nodeArguments`), environment variables (`cursorpyright.nodeEnvVars`) and executable (`cursorpyright.nodeExecutable`) used to run the Pyright process.
