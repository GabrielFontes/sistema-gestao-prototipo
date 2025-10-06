import React from "react";
import { Award } from "lucide-react";

interface AwardWithNumberProps {
  number: number;
  size?: number;
  color?: string;
}

export const AwardWithNumber: React.FC<AwardWithNumberProps> = ({
  number,
  size = 20,
  color = "gold",
}) => {
  return (
    <div style={{ position: "relative", display: "inline-block", width: size, height: size }}>
      <Award size={size} color={color} />
      <div
        style={{
          position: "absolute",
          top: "33%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontWeight: "bold",
          fontSize: size / 3.5,
          color: "#000",
        }}
      >
        {number}
      </div>
    </div>
  );
};