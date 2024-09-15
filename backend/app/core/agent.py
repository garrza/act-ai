from lavague.core import WorldModel, ActionEngine
from lavague.core.agents import WebAgent as LaVagueWebAgent

class WebAgent(LaVagueWebAgent):
    def __init__(self, world_model, action_engine):
        super().__init__(world_model, action_engine)

    def get(self, url):
        self.action_engine.driver.get(url)

    def run(self, task):
        return super().run(task)
