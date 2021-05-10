import React, { Component } from 'react';
import axios from 'axios';
import InputBlock from './InputBlock';
import './App.css';

const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  responsibilities: '',
  support_phone: '',
}

class App extends Component {
  state = {
    formData: initialFormState,
    userTypes: [
      {
        value: "selectUserType",
        name: "Please select user type",
      },
    ],
    selectedUserType: "selectUserType",
    extraInputs: {},
    extraInputToShow: [],
  }

  componentDidMount() {
    axios.get("https://my-json-server.typicode.com/jason-ogasian-walmart/interview-api/user_create")
      .then(res => {
        const response = res.data;
        const { user_types = [], extra_text_inputs } = response;
        const { userTypes } = this.state;
        const computedUserTypes = user_types.reduce((acc, curr = '') => {
          acc.push({
            value: curr,
            name: curr.toUpperCase()
          })
          return acc
        }, []);
        this.setState({ userTypes: [...userTypes, ...computedUserTypes], extraInputs: extra_text_inputs });
      })
  }

  handleSelectChange = (event) => {
    const selectedUserType = event.target.value;
    const { extraInputs } = this.state
    this.setState({ selectedUserType, extraInputToShow: extraInputs[selectedUserType] });
  }

  handleChange = (event, type) => {
    const value = event.target.value;
    const { formData } = this.state;
    this.setState({ formData: { ...formData, [type]: value } });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { formData, selectedUserType, extraInputToShow } = this.state;
    const { firstName, lastName, email, responsibilities, support_phone } = formData;
    const showExtraInput = extraInputToShow && extraInputToShow.length;
    const extraInputData = showExtraInput
      ? {
          admin: { responsibilities },
          support: { support_phone }
        }
      : {}
    const data = {
      first_name: firstName,
      last_name: lastName,
      email,
      type: selectedUserType,
      ...extraInputData[selectedUserType]
    };
    if (selectedUserType === "selectUserType") {
      alert("Please select user type");
    } else {
        axios({
          method: "post",
          url: "https://my-json-server.typicode.com/jason-ogasian-walmart/interview-api/update_user",
          data
        }).then(() => {
          this.setState({ formData: initialFormState, selectedUserType: "selectUserType" });
          alert("The form is successfully submitted");
        }).catch(() => {
          alert("Something went wrong. Please try after sometime.");
        });
    }
  }

  render() {
    const { formData, userTypes, selectedUserType, extraInputToShow } = this.state;
    const { firstName, lastName, email } = formData;
    const showExtraInput = extraInputToShow && extraInputToShow.length;
    const inputMap = [
      {
        key: "firstName",
        value: firstName,
        name: "First Name:",
        type: "text",
        handler: (event) => this.handleChange(event, "firstName")
      },
      {
        key: "lastName",
        value: lastName,
        name: "Last Name:",
        type: "text",
        handler: (event) => this.handleChange(event, "lastName")
      },
      {
        key: "email",
        value: email,
        name: "Email:",
        type: "email",
        handler: (event) => this.handleChange(event, "email")
      }
    ];

    return (
      <form onSubmit={this.handleSubmit} className="form">
        <h2 className="heading">Please fill the form</h2>
        {inputMap.map((input) => (
          <InputBlock key={input.key} input={input} />
        ))}
        <div className="input-block">
          <label className="input-data">
            <span className="input-name">User Type:</span>
            <select
              className="input-select"
              value={selectedUserType}
              onChange={this.handleSelectChange}
            >
              {userTypes.map((userType) => (
                <option key={userType.value} value={userType.value}>{userType.name}</option>
              ))}
            </select>
          </label>
        </div>
        {!!showExtraInput && (
          <InputBlock
            input={
              {
                key: extraInputToShow[0].value,
                value: formData[extraInputToShow[0].value],
                name: `${extraInputToShow[0].label}: `,
                type: "text",
                handler: (event) => this.handleChange(event, extraInputToShow[0].value)
              }
            }
          />
        )}
        <div className="input-block btn-container">
          <input type="submit" value="Submit" className="btn"/>
        </div>
      </form>
    )
  }
}

export default App;
