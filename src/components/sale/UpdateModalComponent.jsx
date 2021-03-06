import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import moment from "moment";

const UpdateModalComponent = (props) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [outletyList, setoutletyList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const { addToast } = useToasts();

  const handleClose = () => {
    setShow(false);
    setInputError("");
  };
  const handleShow = () => setShow(true);

  const getOutlet = () => {
    axios
      .get("http://127.0.0.1:8000/api/outlet/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setoutletyList(getList);
        else {
          addToast(response.data.errorMessage, {
            appearance: "success",
            autoDismiss: true,
          });
        }
      })
      .catch((error) => {
        addToast(error.message, {
          appearance: "success",
          autoDismiss: true,
        });
      });
  };

  const getCustomer = () => {
    axios
      .get("http://127.0.0.1:8000/api/customer/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setCustomerList(getList);
        else {
          addToast(response.data.errorMessage, {
            appearance: "success",
            autoDismiss: true,
          });
        }
      })
      .catch((error) => {
        addToast(error.message, {
          appearance: "success",
          autoDismiss: true,
        });
      });
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/sale/" + props.Id + "/")
      .then((response) => {
        const { status, getSingle } = response.data;
        if (status) setInput(getSingle);
        else {
          handleClose();
          addToast(response.data.errorMessage, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .catch((error) => {
        handleClose();
        addToast(error.message, {
          appearance: "error",
          autoDismiss: true,
        });
      });

    getOutlet();
    getCustomer();
  }, [props.Id, addToast]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
  };

  const onClickHandler = () => {
    console.log(input);
    axios
      .patch("http://127.0.0.1:8000/api/sale/edit/" + props.Id + "/", input)
      .then((response) => {
        const { status, patchMessage } = response.data;
        if (status) {
          handleClose();
          addToast(patchMessage, {
            appearance: "success",
            autoDismiss: true,
          });
          props.callBack(true);
        } else if (status === false) {
          setInputError(response.data.patchError);
        } else {
          handleClose();
          addToast(response.data.errorMessage, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .catch((error) => {
        handleClose();
        addToast(error.message, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  return (
    <>
      {/* <Button variant="primary" size="sm" onClick={handleShow}>
        Update
      </Button> */}
      <Dropdown.Item
        className="bg-primary text-light my-2"
        onClick={handleShow}
      >
        Edit
      </Dropdown.Item>

      <Modal show={show} onHide={handleClose} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Update Sale</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {auth.Role == "admin" ? (
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  as="select"
                  name="Outlet"
                  value={input.Outlet}
                  onChange={onChangeHandler}
                >
                  <option hidden>Select Outlet</option>
                  {outletyList.map((outlet, index) => (
                    <option key={index} value={outlet.id}>
                      {outlet.Name}
                    </option>
                  ))}
                </Form.Control>
                <Form.Text className="text-danger">
                  {inputError.Outlet}
                </Form.Text>
              </Form.Group>
            ) : null}

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                as="select"
                name="Customer"
                value={input.Customer}
                onChange={onChangeHandler}
              >
                <option hidden>Select Customer</option>
                {customerList.map((customer, index) => (
                  <option key={index} value={customer.id}>
                    {customer.Name}
                  </option>
                ))}
              </Form.Control>
              <Form.Text className="text-danger">
                {inputError.Customer}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="number"
                name="Discount"
                placeholder="Discount"
                value={input.Discount}
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">
                {inputError.Discount}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="datetime-local"
                name="Date"
                placeholder="Date"
                value={moment(input.Date).utc().toISOString().replace("Z", "")}
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">{inputError.Date}</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" className="w-100" onClick={onClickHandler}>
            SAVE CHANGES
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateModalComponent;
