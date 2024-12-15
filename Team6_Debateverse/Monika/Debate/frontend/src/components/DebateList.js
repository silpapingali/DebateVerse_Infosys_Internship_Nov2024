import React, { useState, useEffect } from "react";
import axios from "../api";
import DebateCard from "./DebateCard";

const DebateList = () => {
  const [debates, setDebates] = useState([]);

  useEffect(() => {
    axios.get("/debates").then((res) => setDebates(res.data));
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>My Debates</h2>
      {debates.map((debate) => (
        <DebateCard key={debate.id} debate={debate} />
      ))}
    </div>
  );
};

export default DebateList;
