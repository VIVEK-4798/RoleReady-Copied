import React, { useEffect, useRef } from "react";
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import Tooltip from "cal-heatmap/plugins/Tooltip";

const StreaksSection = () => {
  const calRef = useRef(null); 

  useEffect(() => {
    if (calRef.current) return;

    const simulatedData = {
      "2024-08-10": 1,
      "2025-03-01": 5,
      "2025-03-02": 2,
      "2025-03-03": 3,
      "2025-03-04": 1,
      "2025-03-06": 4,
    };

    const data = [
      { date: "2025-02-20", value: 1 },
      { date: "2025-03-01", value: 5 },
      { date: "2025-03-02", value: 2 },
      { date: "2025-03-03", value: 3 },
      { date: "2025-04-01", value: 4 },
      { date: "2025-04-06", value: 2 },
    ];

    const transformedData = Object.entries(simulatedData).reduce(
      (acc, [dateStr, count]) => {
        const timestamp = new Date(dateStr).getTime() / 1000;
        acc[timestamp] = count;
        return acc;
      },
      {}
    );

    const cal = new CalHeatmap();
    calRef.current = cal; 

    cal.paint({
      itemSelector: "#cal-heatmap",
      domain: {
        type: "month",
        label: { position: "top" },
        gutter: 10,
      },
      subDomain: {
        type: "day",
        radius: 2,
        width: 12,
        height: 12,
      },
      range: 12,
      date: { start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) },
      scale: {
        color: {
          scheme: "YlGn",
          domain: [0, 1, 2, 3, 4, 5],
        },
      },
      data: {
        source: data,
        x: "date",
        y: "value",
      },
    },
    [
      [
        Tooltip,
        {
          text: function (date, value, dayjsDate) {
            return (
              (value ? value + '°C' : 'No data') + ' on ' + dayjsDate.format('LL')
            );
          },
        },
      ],
    ]
  );

    return () =>
      cal.destroy().then(() => {
        calRef.current = null;
      });
  }, []);

  return (
    <div className="mb-8">
      <h4>Contributions in the past year</h4>
      <div id="cal-heatmap"></div>
    </div>
  );
};

export default StreaksSection;
