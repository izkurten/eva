async function loadData() {

  const response = await fetch("data.json");

  const data = await response.json();

  createChart(data);

  createLog(data);
}


/* --------------------------------------------------
 GRAPH
-------------------------------------------------- */

function createChart(data) {
  if (data.length === 0) {
      document.getElementById("chart").innerHTML =
          "<p>No data yet.</p>";
      return;
  }

  const timestamps = data.map(item => item.timestamp);
  const times = data.map(item => item.minutes);

  const hoverText = data.map(item => {
      const message = item.message
          ? `<br>${item.message}`
          : "";

      return `${item.display_date} ${item.time}${message}`;
  });

  const trace = {
      x: timestamps,
      y: times,

      mode: "lines+markers",
      type: "scatter",

      line: {
          width: 1.5
      },

      marker: {
          size: 9
      },

      text: hoverText,

      hovertemplate:
          "%{text}" +
          "<extra></extra>"
  };

  const layout = {
      margin: {
          l: 65,
          r: 20,
          t: 20,
          b: 70
      },

      xaxis: {
          title: "Date",

          type: "date",

          tickformat: "%d %b",

          nticks: 15,

          tickangle: -45,

          gridcolor: "#eeeeee",

          zeroline: false
      },

      yaxis: {
          title: "Time",

          range: [0, 1440],

          tickmode: "array",

          tickvals: [
              0,
              120,
              240,
              360,
              480,
              600,
              720,
              840,
              960,
              1080,
              1200,
              1320,
              1440
          ],

          ticktext: [
              "00:00",
              "02:00",
              "04:00",
              "06:00",
              "08:00",
              "10:00",
              "12:00",
              "14:00",
              "16:00",
              "18:00",
              "20:00",
              "22:00",
              "24:00"
          ],

          gridcolor: "#eeeeee",

          zeroline: false
      },

      hovermode: "closest",

      plot_bgcolor: "#eeeeee",
      paper_bgcolor: "white"
  };

  const config = {
      responsive: true,
      displayModeBar: false
  };

  Plotly.newPlot(
      "chart",
      [trace],
      layout,
      config
  );
}


/* --------------------------------------------------
 MESSAGE LOG
-------------------------------------------------- */

function createLog(data) {

  const log = document.getElementById("log");


  if (data.length === 0) {

      log.innerHTML =
          "<p>No events yet.</p>";

      return;
  }


  /*
     Group events by date.
  */

  const grouped = {};


  data.forEach(item => {

      if (!grouped[item.date]) {
          grouped[item.date] = [];
      }

      grouped[item.date].push(item);
  });


  /*
     Create HTML.
  */

  for (const date in grouped) {

      const day = document.createElement("div");

      day.className = "day";


      const title = document.createElement("div");

      title.className = "day-title";

      title.textContent =
          grouped[date][0].display_date;


      day.appendChild(title);


      grouped[date].forEach(item => {

          const event = document.createElement("div");

          event.className = "event";


          const time = document.createElement("div");

          time.className = "event-time";

          time.textContent = item.time;


          const message = document.createElement("div");

          message.className = "event-message";

          message.textContent = item.message;


          event.appendChild(time);

          event.appendChild(message);


          day.appendChild(event);
      });


      log.appendChild(day);
  }
}

function setupLogToggle() {
  const button = document.getElementById("log-toggle");
  const log = document.getElementById("log");
  const arrow = document.getElementById("log-arrow");

  button.addEventListener("click", () => {
      const isCollapsed = log.classList.contains("collapsed");

      if (isCollapsed) {
          log.classList.remove("collapsed");
          arrow.textContent = "▲";
      } else {
          log.classList.add("collapsed");
          arrow.textContent = "▼";
      }
  });
}

setupLogToggle();

/* --------------------------------------------------
 Start
-------------------------------------------------- */

loadData();