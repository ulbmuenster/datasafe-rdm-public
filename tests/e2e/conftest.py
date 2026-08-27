import os

import pytest
from selenium import webdriver

remote_driver = os.environ.get("REMOTE_DRIVER", "")
app_url = os.environ.get("APP_URL", "https://127.0.0.1:5000")
user_pwd = os.environ.get("USER_PWD", "1qayxsw2")


@pytest.fixture(scope="function")
def driver():
    if remote_driver:
        options = webdriver.FirefoxOptions()
        options.acceptInsecureCerts = True
        options.add_argument("-headless")
        driver = webdriver.Remote(
            command_executor=f"http://{remote_driver}:4444/wd/hub", options=options
        )
        driver.set_window_size(2048, 1120)
    else:
        options = webdriver.FirefoxOptions()
        options.acceptInsecureCerts = True
        options.add_argument("-headless")
        driver = webdriver.Firefox(options=options)
        driver.set_window_size(2048, 1120)

    yield driver
    driver.quit()
