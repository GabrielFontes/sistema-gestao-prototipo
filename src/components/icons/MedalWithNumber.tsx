import React from "react";
import { Medal } from "lucide-react";

interface MedalWithNumberProps {
  number: number;
  size?: number;
  color?: string;
}

export const MedalWithNumber: React.FC<MedalWithNumberProps> = ({
  number,
  size = 20,
  color = "gold",
}) => {
  return (
    <div style={{ position: "relative", display: "inline-block", width: size, height: size }}>
      <Medal size={size} color={color} />
      <div
        style={{
          position: "absolute",
          top: "70%", // ajusta verticalmente
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
