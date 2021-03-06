import React from "react";
import CreateModalComponent from "./CreateModalComponent";
import { NavLink } from "react-router-dom";
import { Row, Col, Nav, Navbar, Form, FormControl } from "react-bootstrap";
import { ToastProvider } from "react-toast-notifications";

const NavbarComponent = (props) => {
  const callBackHandle = (isCreate) => {
    props.callBack(isCreate);
  };
  const onChangeHandle = (input) => {
    let searchValue = input.target.value.toLowerCase();
    props.searchCallBack(searchValue);
  };
  return (
    <Row>
      <Col>
        <Navbar expand="lg">
          <Navbar.Brand as={NavLink} to="/supplier">
            All Supplier
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto"></Nav>
            <Form inline>
              <FormControl
                type="text"
                placeholder="Search"
                className="mr-sm-2"
                onChange={onChangeHandle}
              />
            </Form>
            <ToastProvider>
              <CreateModalComponent callBack={callBackHandle} />
            </ToastProvider>
          </Navbar.Collapse>
        </Navbar>
      </Col>
    </Row>
  );
};

export default NavbarComponent;
