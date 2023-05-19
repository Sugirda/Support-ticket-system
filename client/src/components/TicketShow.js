import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { Dropdown, Badge, Modal, Button } from 'react-bootstrap';

class ShowTickets extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      show: false,
      message: '',
      id: '',
      search: '',
      role: null,
    };
  }

  componentDidMount() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);

    this.getTicket();

    this.setState({
      role: decoded.role,
    });
  }

  getTicket = () => {
    axios
      .get('tickets/getTicketAll')
      .then((response) => {
        this.setState({
          data: response.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleClose = () => {
    this.setState({
      show: false,
    });
  };

  handleAddMessage = (id, messages) => {
    this.addMessage(id, messages);

    this.setState({
      show: false,
    });

    this.getTicket();
  };

  handleShow = (id) => {
    this.setState({ show: true, id: id });
  };

  editSearchTerm = (e) => {
    const { data } = this.state;

    if (e.target.value) {
      const newData = data.filter((item) =>
        item.name.toUpperCase().includes(e.target.value.toUpperCase())
      );

      this.setState({
        search: e.target.value,
        data: newData,
      });
    } else {
      this.setState({
        search: '',
      });
      this.getTicket();
    }
  };

  changeStatus = (id, status) => {
    axios
      .put('tickets/changeStatus', {
        id,
        status,
      })
      .then(() => {
        this.getTicket();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  statusFilter = (status) => {
    axios
      .post('tickets/filterStatus', {
        status,
      })
      .then((response) => {
        this.setState({
          data: response.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  addMessage = (id, messages) => {
    axios
      .post('tickets/addMessages', {
        id,
        messages,
      })
      .then(() => {
        this.getTicket();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  statusName = (status) => {
    switch (status) {
      case 0:
        return <h5><Badge pill variant="primary">Opening</Badge></h5>;
      case 1:
        return <h5><Badge pill variant="danger">Waiting</Badge></h5>;
      case 2:
        return <h5><Badge pill variant="success">Closed</Badge></h5>;
      default:
        return <h5><Badge pill variant="primary">Opening</Badge></h5>;
    }
  };

  render() {
    const { data, role, search, show, id, message } = this.state;

    return (
      <div className="container">
        {role === 1 ? (
          <div className="jumbotron mt-5">
            <div className="col-sm-8 mx-auto">
              <h1 className="text-center">Ticket List</h1>
            </div>
            <div className="col-sm-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name"
                value={search}
                onChange={this.editSearchTerm}
              />
            </div>
            <table className="table col-md-8 mx-auto">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Message</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((ticket) => (
                  <tr key={ticket._id}>
                    <td>{ticket.name}</td>
                    <td>{ticket.messages[ticket.messages.length - 1].message}</td>
                    <td>{this.statusName(ticket.status)}</td>
                    <td>
                      <Button
                        className="btn btn-info"
                        onClick={() => this.handleShow(ticket._id)}
                      >
                        Reply
                      </Button>
                    </td>
                    <Dropdown className="m-2">
                      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        Change Status
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => this.changeStatus(ticket._id, 0)}
                        >
                          Opening
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => this.changeStatus(ticket._id, 1)}
                        >
                          Waiting
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => this.changeStatus(ticket._id, 2)}
                        >
                          Closed
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="jumbotron mt-5">
            <div className="col-sm-8 mx-auto">
              <h1 className="text-center">User Ticket List</h1>
            </div>
            <div className="col-sm-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name"
                value={search}
                onChange={this.editSearchTerm}
              />
            </div>
            <table className="table col-md-8 mx-auto">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Message</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((ticket) => (
                  <tr key={ticket._id}>
                    <td>{ticket.name}</td>
                    <td>{ticket.messages[ticket.messages.length - 1].message}</td>
                    <td>{this.statusName(ticket.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Modal show={show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Reply</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <input
                  type="text"
                  className="form-control"
                  name="message"
                  value={message}
                  onChange={this.handleChange}
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => this.handleAddMessage(id, message)}>
              Reply
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ShowTickets;