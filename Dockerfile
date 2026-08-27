# syntax=docker/dockerfile:1
#
# Build with:
#   docker build -t datasafe-rdm:latest .
#
# A `uv.lock` (generate with `invenio-cli packages lock`) must be present at the
# repository root before building.

FROM ghcr.io/inveniosoftware/invenio:14-debian

COPY site ./site
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen
# uv always uses a venv. Append it to the PATH:
ENV PATH=".venv/bin:$PATH"

COPY ./docker/uwsgi/ ${INVENIO_INSTANCE_PATH}
COPY ./invenio.cfg ${INVENIO_INSTANCE_PATH}
COPY ./templates/ ${INVENIO_INSTANCE_PATH}/templates/
COPY ./app_data/ ${INVENIO_INSTANCE_PATH}/app_data/
COPY ./translations/ ${INVENIO_INSTANCE_PATH}/translations/
COPY ./ .

RUN invenio i18n js-translation distribute --input-directory .venv/lib/python3.12/site-packages/invenio_translations_de/ui && \
    cp -r ./static/. ${INVENIO_INSTANCE_PATH}/static/ && \
    cp -r ./assets/. ${INVENIO_INSTANCE_PATH}/assets/ && \
    invenio collect --verbose  && \
    invenio webpack buildall

ENTRYPOINT ["/bin/bash", "-c"]
