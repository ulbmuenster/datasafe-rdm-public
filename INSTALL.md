# Installation of datasafe-rdm

## Prerequisites

In order to use this InvenioRDM instance, the correct environment must be installed. See the [official InvenioRDM
documentation](https://inveniordm.docs.cern.ch/install/) for setting up a development environment with `invenio-cli`.

All `invenio` commands must be run inside the datasafe-rdm virtual environment.

Note: `invenio-pdf-generator` and `invenio-purge-expired` are installed straight from GitHub (see
`[tool.uv.sources]` in `pyproject.toml`) rather than from PyPI, so no package registry credentials are required.

## Installation of the instance

```shell
cd datasafe-rdm
invenio-cli install
```

## Environment setup

This guide assumes that the needed services (postgres, redis, elasticsearch, rabbitmq) are already installed and
running.

To do this call `invenio-cli services setup -f`.

## Additional steps

In order to have a fully working datasafe-RDM instance, the following steps are necessary if you don't use a local installation via devbox:

### Vocabularies

Import/update affiliations and other vocabularies as described in the [official InvenioRDM
documentation](https://inveniordm.docs.cern.ch/customize/vocabularies/) and `app_data/vocabularies.yaml`:

```shell
invenio rdm-records add-to-fixture affiliations
```

### Users

Activate admin user:

```shell
invenio roles create admin
invenio access allow superuser-access role admin
invenio users activate admin@inveniosoftware.org
```

If you need to sync users from an external directory (e.g. LDAP), see the [official InvenioRDM
documentation](https://inveniordm.docs.cern.ch/customize/authentication/) — the original University of Münster LDAP
sync integration (`invenio-sync-users`) has been removed from this public template.

### Static pages

- The initial HTML pages for the static pages are present in the `/app_data/pages`. Once a new database is set up (for instance with `invenio-cli services setup`) these pages are created.
- If the database is already present and the entries in the `app_data` folder are added afterwards you need to run `invenio rdm pages create` (optional force option to overwrite existing pages with the content from `app_data/pages` folder: `-f`)

### Translations

To compile translations:

```shell
invenio-cli translations compile
```

The translation-bundle (`invenio_translations_de`) is a German translation package for InvenioRDM based on
[`invenio-translations-de-tugraz-experiment`](https://github.com/utnapischtim/invenio-translations-de-tugraz-experiment)
(Graz University of Technology). Installed into the virtual environment, it overrides the default German
translations (both Python/Jinja and JS) of every bundled InvenioRDM module — not just this instance's own strings —
so check it first before adding an override here. To distribute its JS translations into the installed packages:

```shell
invenio i18n distribute-js-translations --input-directory ${VIRTUAL_ENV}/lib/python3.12/site-packages/invenio_translations_de/ui
```

### Custom Fields & other initialisation

```shell
invenio rdm-records custom-fields init
invenio rdm fixtures
invenio rdm-records fixtures
invenio queues declare
```

## Docker deployment

An [example `Dockerfile`](Dockerfile) is provided, based on the official InvenioRDM base image. See the official
InvenioRDM
[documentation](https://inveniordm.docs.cern.ch/install/build-setup-run/#option-1-container-install) for background.

Before building, generate a lock file with `invenio-cli packages lock` (produces `uv.lock`). Then build with:

```shell
docker build -t datasafe-rdm:latest .
```

See `docker-services.yml` / `docker-compose.yml` for the supporting services used in local development.
