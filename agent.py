import ollama, requests

def get_weather(city: str) -> str:
    geo = requests.get("https://geocoding-api.open-meteo.com/v1/search",
        params={"name": city, "count": 1, "country_code": "LK"}).json()
    if not geo.get("results"):
        return "City not found"
    p = geo["results"][0]
    w = requests.get("https://api.open-meteo.com/v1/forecast", params={
        "latitude": p["latitude"], "longitude": p["longitude"],
        "daily": "temperature_2m_max,precipitation_sum",
        "timezone": "Asia/Colombo"}).json()
    return str(w["daily"])

def fuel_cost(total_km: float, km_per_litre: float, price_per_litre: float) -> str:
    return f"LKR {total_km / km_per_litre * price_per_litre:,.0f}"

tools = [get_weather, fuel_cost]
funcs = {f.__name__: f for f in tools}
def chat(messages: list) -> str:
    """Takes the conversation so far, returns the agent's final reply."""
    while True:
        r = ollama.chat(model="wanderlk", messages=messages, tools=tools)
        messages.append(r.message)
        if not r.message.tool_calls:
            return r.message.content
        for call in r.message.tool_calls:
            try:
                result = funcs[call.function.name](**call.function.arguments)
            except Exception as e:
                result = f"Tool error: {e}"
            messages.append({"role": "tool", "content": str(result),
                             "tool_name": call.function.name})

if __name__ == "__main__":      # terminal mode still works
    history = []
    while True:
        history.append({"role": "user", "content": input("You: ")})
        print("Wanderlk:", chat(history))