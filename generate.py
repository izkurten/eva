from pathlib import Path
import json
import pandas as pd

DATA_FILE = Path("data.txt")
OUTPUT_FILE = Path("data.json")

rows = []

with DATA_FILE.open("r", encoding="utf-8") as file:
    for line_number, line in enumerate(file, start=1):
        line = line.strip()

        if not line:
            continue

        try:
            if " | " in line:
                datetime_text, message = line.split(" | ", 1)
                message = message.strip()
            else:
                datetime_text = line
                message = ""

            timestamp = pd.to_datetime(
                datetime_text.strip(),
                format="%H:%M %d.%m.%Y"
            )

            rows.append({
                "datetime": timestamp,
                "message": message
            })

        except ValueError:
            print(
                f"WARNING: Could not parse line {line_number}: "
                f"{line}"
            )

df = pd.DataFrame(rows)

if df.empty:
    df = pd.DataFrame(columns=["datetime", "message"])
else:
    df = (
        df
        .sort_values("datetime")
        .reset_index(drop=True)
    )

output = []

for _, row in df.iterrows():
    timestamp = row["datetime"]

    minutes_after_midnight = (
    timestamp.hour * 60
    + timestamp.minute
)

    output.append({
      "timestamp": timestamp.strftime("%Y-%m-%dT%H:%M:%S"),
      "date": timestamp.strftime("%Y-%m-%d"),
      "display_date": timestamp.strftime("%d.%m.%Y"),
      "time": timestamp.strftime("%H:%M"),
      "minutes": minutes_after_midnight,
      "message": row["message"]
})
    

OUTPUT_FILE.parent.mkdir(
    parents=True,
    exist_ok=True
)

with OUTPUT_FILE.open(
    "w",
    encoding="utf-8"
) as file:
    json.dump(
        output,
        file,
        ensure_ascii=False,
        indent=2
    )

print(f"Generated {len(output)} records.")
print(f"Output: {OUTPUT_FILE}")
