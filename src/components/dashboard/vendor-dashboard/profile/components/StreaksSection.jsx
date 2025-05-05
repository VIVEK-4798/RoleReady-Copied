import React, { useEffect, useRef } from "react";
import axios from "axios";
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import { api } from "@/utils/apiProvider";

const StreaksSection = () => {
  const calRef = useRef(null);
  const isPainted = useRef(false); 

  useEffect(() => {
    const fetchStreakData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      // if (!user || isPainted.current) return;
      if (!user) return;

      try {
        const response = await axios.get(`${api}/api/user-activity/login-streak/${user.user_id}`);
        const streakData = response.data;
        
        const transformedData = {};
        streakData.forEach(item => {
          const localDate = new Date(item.date);
          localDate.setHours(0, 0, 0, 0); 
          const timestamp = Math.floor(localDate.getTime() / 1000);          
          console.log("Final mapped:", timestamp, new Date(timestamp * 1000));
          transformedData[timestamp] = Number(item.activity_count);   
          console.log("Transformed Data:", transformedData);       
        });
        
        const cal = new CalHeatmap();
        calRef.current = cal;
        const maxValue = Math.max(...Object.values(transformedData));
        const currentYear = new Date().getFullYear();
        const start = new Date(currentYear, 0, 1);
        
        await cal.paint({
          itemSelector: "#cal-heatmap",
          domain: { type: "month", label: { position: "top" }, gutter: 10 },
          subDomain: { type: "day", radius: 2, width: 12, height: 12 },
          range: 12,
          date: { start },
          scale: {
            color: {
              scheme: "YlGn",
              domain: [0, maxValue || 5],
              type: "linear",
            },
          },
          data: {
            source: transformedData,
            type: "json",
          },
        }, [
          [
            Tooltip,
            {
              text: function (date, value, dayjsDate) {
                const formattedDate = dayjsDate.format("D MMM");
                return `${formattedDate} | ${value ? value + " Activities" : "No Activities"}`;
              },
            },
          ],
        ]);

        isPainted.current = true; 
      } catch (error) {
        console.error("Failed to fetch streak data", error);
      }
    };

    fetchStreakData();

    return () => {
      isPainted.current = false; 
      if (calRef.current) {
        calRef.current.destroy().then(() => {
          calRef.current = null;
          const container = document.getElementById("cal-heatmap");
          if (container) container.innerHTML = "";
        });
      }
    };
  }, []);

  return (
    <div className="mb-8">
      <h4 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "10px" }}>
        Contributions in the past year
      </h4>
      <div
        id="cal-heatmap"
        style={{
          width: "100%",
          maxWidth: "100%",
          overflowX: "auto",
          paddingBottom: "10px",
        }}
      ></div>
    </div>
  );
};

export default StreaksSection;
