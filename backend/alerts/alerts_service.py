from alerts.models import Answer
from schemas import AlertsRequest, AlertResponse
from config import ALERTS_API_URL


class AlertService:
    def __init__(self):
        self.url = ALERTS_API_URL

    async def fetch_alerts(self) -> Answer:
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.get(self.url)
            response.raise_for_status()
            return Answer(**response.json())

    async def filter_alerts(self, req: AlertsRequest) -> AlertResponse:
        data = await self.fetch_alerts()

        items = data.newses

        if req.province:
            req_low = req.province.lower()
            items = [
                n for n in items
                if any(p.name.lower() == req_low for p in n.provinces.values())
            ]

        if req.alarm_only:
            items = [n for n in items if n.rso_alarm == "1"]

        return AlertResponse(
            total=len(data.newses),
            filtered=len(items),
            items=items,
            raw=data
        )
