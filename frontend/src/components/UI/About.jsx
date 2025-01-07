import { Container, Row, Col } from "react-bootstrap";

const AboutSection = () => {
  return (
    <Container>
      {/* About This Project */}
      <Row className="py-4">
        <Col md={10}>
          <h1 className="text-dark fw-bold fs-4 lh-tight">
            About this project
          </h1>
          <p className="text-dark fs-6">
            This project is a demonstration of my full-stack development skills,
            showcasing various features and functionality implemented using
            modern web technologies. It serves as a comprehensive portfolio
            highlighting my expertise in building scalable and efficient web
            applications.
          </p>
          <p className="text-dark fs-6">Created by Al-Sharif Suhaim.</p>
        </Col>
      </Row>

      {/* Technologies Used */}
      <Row className="py-4">
        <Col md={10}>
          <h1 className="text-dark fw-bold fs-4 lh-tight">Technologies used</h1>
          <p className="text-dark fs-6">
            The website is built using modern web technologies including React,
            Bootstrap , and a backend framework such as Express.js. It also
            leverages a database system like MongoDB for data management.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutSection;
