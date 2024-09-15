from lavague.drivers.selenium import SeleniumDriver as LaVagueSeleniumDriver
from selenium import webdriver


class SeleniumDriverWrapper:
    def __init__(self, headless=False):
        self.driver = SeleniumDriver(headless=headless)

    def get_driver(self):
        return self.driver


class SeleniumDriver(LaVagueSeleniumDriver):
    def __init__(self, headless=False):
        super().__init__(headless=headless)

    def get_capability(self):
        # Return the Selenium driver capabilities
        return self.driver.capabilities

    def get(self, url):
        self.driver.get(url)

    @property
    def page_source(self):
        return self.driver.page_source

    def get_screenshot_as_base64(self):
        return self.driver.get_screenshot_as_base64()
