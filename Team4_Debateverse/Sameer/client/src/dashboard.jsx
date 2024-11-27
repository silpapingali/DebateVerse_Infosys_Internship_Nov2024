import React, { useEffect } from "react";
function Dashboard() {
  useEffect(() => {
    axios
      .get("http://localhost:3001")
      .then((result) => {
        console.log("Response data:", result.data);

        if (result.data.Status === "Success") {
          console.log("user role :", result.data.role);
          if (result.data.role === "admin") {
            navigate("/Dashboard");
          } else {
            navigate("/Home");
          }
        }
      })

      .catch((err) => console.log(err));
  }, []);
  return <div>Dashboard</div>;
}
export default Dashboard;
