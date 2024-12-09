import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

const AdminDashboard = () => {
  const { isAuth, role } = useContext(UserContext);

  const handleClick = () => {
    console.log(isAuth, role);
  };

  return (
    <div>
      {/* Background Section with Gradient */}
      <div className="pt-5 pb-5 bg-emerald-400">
        <Container className="text-white text-center">
          <h1 className="text-4xl font-bold mb-3">Welcome to the Admin Dashboard</h1>
          <p className="text-lg mb-4">Manage users, view analytics, and monitor system performance.</p>
          <Button variant="light" onClick={handleClick}>
            Check Auth & Role
          </Button>
        </Container>
      </div>

      {/* Content Section with Dashboard Info */}
      <Container className="my-5">
        <Row>
          {/* Example of Dashboard Card 1 */}
          <Col md={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>User Management</Card.Title>
                <Card.Text>
                  View and manage all users in the system easily. Add, delete, or monitor roles here.
                </Card.Text>
                <Button variant="primary" onClick={handleClick}>
                  Manage Users
                </Button>
              </Card.Body>
            </Card>
          </Col>
          {/* Example of Dashboard Card 2 */}
          <Col md={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>Analytics</Card.Title>
                <Card.Text>
                  Analyze data and track KPIs with ease. Insights for better decision-making.
                </Card.Text>
                <Button variant="success" onClick={handleClick}>
                  View Analytics
                </Button>
              </Card.Body>
            </Card>
          </Col>
          {/* Example of Dashboard Card 3 */}
          <Col md={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>System Logs</Card.Title>
                <Card.Text>
                  Monitor all logs and system activities for troubleshooting purposes.
                </Card.Text>
                <Button variant="danger" onClick={handleClick}>
                  View Logs
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
