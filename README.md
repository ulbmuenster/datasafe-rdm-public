# datasafe-rdm

This repository is the base for the datasafe-rdm instance, an [InvenioRDM](https://inveniordm.docs.cern.ch/)-based
research data archive originally developed by the [University of Münster](https://www.uni-muenster.de/). It contains
custom vocabularies, theming, overridden Jinja templates and custom React components.

This is a public template release of the codebase: University of Münster-specific integrations, branding, legal
pages, and contact information have been removed or replaced with placeholder content marked `TODO`. See
[Publishing this template](#publishing-this-template) below for what to still adapt before running your own instance.

## Disclaimer

This software is provided **as is**, without warranty of any kind, without support, and without any guarantee it is
fit for a particular purpose — see [LICENSE](LICENSE) for the full MIT license text. The University of Münster and
the contributors to this repository accept **no responsibility or liability for data loss, service disruption, or
any other damages** arising from the use, deployment, or modification of this software. Use it at your own risk, and
always maintain your own backups.

## Publishing this template

Before deploying your own instance, you will likely need to:

- Replace the placeholder legal pages in `app_data/pages/` (`terms.html(.de)`, `faq.html(.de)`) and
  `site/datasafe_rdm/templates/semantic-ui/datasafe_rdm/privacy.html` with your own terms of use, FAQ, and privacy
  policy.
- Set your own contact address, logo, and branding (see the `TODO` comments in `invenio.cfg` and in the
  `templates/` folder).
- Regenerate the translation catalogs under `translations/` and
  `site/datasafe_rdm/assets/semantic-ui/translations/datasafe_rdm/` once you've adjusted the templates above, since
  they were extracted from the original University of Münster content (`invenio-cli translations update`). We build
  on top of [`invenio-translations-de-tugraz-experiment`](https://github.com/utnapischtim/invenio-translations-de-tugraz-experiment)
  (Graz University of Technology) — installing that package and running `invenio i18n distribute-js-translations`
  against it overrides the default German translations of every bundled InvenioRDM module, not just this instance's
  own strings, so it's worth checking upstream first before overriding a string here.
- An [example `Dockerfile`](Dockerfile) is provided for building a container image, based on the official
  InvenioRDM base image. See the
  [official InvenioRDM documentation](https://inveniordm.docs.cern.ch/install/build-setup-run/#option-1-container-install)
  for background, and `docker-services.yml` / `docker-compose.yml` for the supporting services used in local
  development.

## Installation

See [INSTALL.md](INSTALL.md) for more information.

## Testing

### End-to-End Tests

The E2E testing approach starts from the end user’s perspective and simulates a real-world scenario.

To run end-to-end tests locally with selenium you have to do that **outside of the devbox** and in a separate virtual
environment:

```shell
cd datasafe-rdm
python -m venv .venv-e2etest
source .venv-e2etest/bin/activate
pip install -r datasafe-rdm/tests/e2e/requirements.txt
pytest tests/e2e/
```

You must have installed the browser which is used as a webdriver. In this case `Firefox`.

### Unit Tests

**-- WIP --**

To run unit tests locally you have to do that **outside of the devbox** and in a separate virtual environment:

```shell
cd datasafe-rdm
python -m venv .venv-unit
source .venv-unit/bin/activate
pytest site/tests
```

## File Overview

| Name                        | Description                                                                  |
|-----------------------------|------------------------------------------------------------------------------|
| ``app_data``                | Application data such as vocabularies.                                       |
| ``assets``                  | Web assets (CSS, JavaScript, LESS, JSX templates) used in the Webpack build. |
| ``Dockerfile``              | Example Dockerfile for building a container image of the application.       |
| ``docker``                  | Example configuration for NGINX and uWSGI.                                   |
| ``docker-compose.full.yml`` | Example of a full infrastructure stack.                                      |
| ``docker-compose.yml``      | Backend services needed for local development.                               |
| ``docker-services.yml``     | Common services for the Docker Compose files.                                |
| ``invenio.cfg``             | The Invenio application configuration.                                       |
| ``logs``                    | Log files.                                                                   |
| ``static``                  | Static files that need to be served as-is (e.g. images).                     |
| ``templates``               | Folder for your Jinja templates.                                             |

## License

Copyright (C) 2023-2026 University of Münster.

datasafe-RDM is free software; you can redistribute it and/or
modify it under the terms of the MIT License; see LICENSE file for more
details.
