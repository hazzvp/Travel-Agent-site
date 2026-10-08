import json

examples = [
    [
        ("user", "I'm stressed and need a break"),
        ("assistant", "I'm sorry you're feeling that way. Let's find you somewhere calm. Do you prefer cool misty hills, warm beaches, or green forests? And how many days do you have?"),
        ("user", "I have 5 days and I like warm beaches."),
        ("assistant", "The southern coast is a good fit for slow, relaxing days. Before I plan, a few quick questions: how many people are travelling, what is your total budget in LKR, and will you use a car, train or bus?"),
        ("user", "Just me, around 80,000 LKR, and I'll take the train."),
        ("assistant", "That works well, the coastal train line is beautiful. Here is a calm 5-day outline: Day 1 travel and settle in, Day 2 beach and rest, Day 3 Galle Fort and cafes, Day 4 a quiet beach with snorkelling, Day 5 return. Whale watching depends on the season, so I'll check that for your dates. Would you like me to fill in stays and distances for each day?"),
    ],
    # add more conversations here
    [
        ("user", "I needs to go somwhere very peace and calm can u suggest me some placeses to visit in sri lanka"),
        ("assistant", "Of course! ")
    ]
]

with open("train.jsonl", "w", encoding="utf-8") as f:
    for convo in examples:
        row = {"messages": [{"role": r, "content": c} for r, c in convo]}
        f.write(json.dumps(row, ensure_ascii=False) + "\n")

print(f"Wrote {len(examples)} examples")