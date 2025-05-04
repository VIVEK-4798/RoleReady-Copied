import React, { useEffect, useRef } from "react";
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import Tooltip from "cal-heatmap/plugins/Tooltip";

const StreaksSection = () => {
  const calRef = useRef(null); 

  useEffect(() => {
    const fetchStreakData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;
  
      try {
        const response = await axios.get(`${api}/api/user-activity/login-streak/${user.user_id}`);
        const streakData = response.data; // should be [{ date: '2025-04-01', activity_count: 4 }, ...]
  
        const transformedData = streakData.map(item => ({
          date: item.date,
          value: item.activity_count,
        }));
  
        const cal = new CalHeatmap();
        calRef.current = cal;
  
        cal.paint(
          {
            itemSelector: "#cal-heatmap",
            domain: { type: "month", label: { position: "top" }, gutter: 10 },
            subDomain: { type: "day", radius: 2, width: 12, height: 12 },
            range: 12,
            date: { start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) },
            scale: { color: { scheme: "YlGn", domain: [0, 1, 2, 3, 4, 5] } },
            data: {
              source: transformedData,
              x: "date",
              y: "value",
            },
          },
          [
            [
              Tooltip,
              {
                text: function (date, value, dayjsDate) {
                  const formattedDate = dayjsDate.format("D MMM");
                  return `${formattedDate} | ${value ? value + " Activities" : "No Activities"}`;
                },
              },
            ],
          ]
        );
      } catch (error) {
        console.error("Failed to fetch streak data", error);
      }
    };
  
    if (!calRef.current) {
      fetchStreakData();
    }
  
    return () => {
      if (calRef.current) {
        calRef.current.destroy().then(() => (calRef.current = null));
      }
    };
  }, []);
  

  return (
    <div className="mb-8">
      <h4>Contributions in the past year</h4>
      <div id="cal-heatmap"></div>
    </div>
  );
};

export default StreaksSection;
