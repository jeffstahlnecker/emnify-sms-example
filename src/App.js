import * as React from "react";
import axios from "axios";

import "./styles.css";

const baseUrl = "https://cdn.emnify.net/api/v1";

export default function App() {
  const [applicationToken, setApplicationToken] = React.useState("");
  const [authenticationStatus, setAuthenticationStatus] = React.useState(
    "Not Authenticated"
  );
  const [authenticationToken, setAuthenticationToken] = React.useState("");
  const [sms, setSms] = React.useState("");
  const [deviceId, setDeviceId] = React.useState("");
  const [smsStatus, setSmsStatus] = React.useState("");
  const [deviceName, setDeviceName] = React.useState("");
  const [smsId, setSmsId] = React.useState("");

  // API Calls using AXIOS

  async function authenticate(applicationToken) {
    axios
      .post(`${baseUrl}/authenticate`, {
        application_token: applicationToken
      })
      .then((response) => {
        if (response.status === 200) {
          setAuthenticationToken(response.data.auth_token);
          setAuthenticationStatus("AUTHENTICATED");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function getEndpoint(name) {
    axios
      .get(`${baseUrl}/endpoint?q=name%3A${name}`, {
        headers: {
          "Content-Type": `application/json`,
          Authorization: `Bearer ${authenticationToken}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          setDeviceId(response.data[0].id);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function getSms() {
    axios
      .get(`${baseUrl}/endpoint/${deviceId}/sms/${smsId}`, {
        headers: {
          "Content-Type": `application/json`,
          Authorization: `Bearer ${authenticationToken}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          setSmsStatus(response.data.status.description);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function postSms() {
    axios
      .post(
        `${baseUrl}/endpoint/${deviceId}/sms`,
        { source_address: "12345", payload: sms },
        {
          headers: {
            "Content-Type": `application/json`,
            Authorization: `Bearer ${authenticationToken}`
          }
        }
      )
      .then((response) => {
        if (response.status === 201) {
          setSmsStatus("DELIVERY ATTEMPT PENDING");
          setSmsId(response.headers.location.split("/")[8]);
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="App">
      <h1>EMnify SMS Demo</h1>
      <h2>How to send an SMS using the EMnify API</h2>
      <p>
        You can find the EMnify API documentation{" "}
        <a href="https://cdn.emnify.net/api/doc/swagger.html?utm_source=codesandbox&utm_medium=sms+demo">
          here.
        </a>
      </p>
      <form>
        <div>
          <hr />
          <h3>Step 1: Get an Authentication Token</h3>
          <label>
            Application Token: <br />
            <input
              type="text"
              name="token"
              onChange={(e) => setApplicationToken(e.target.value)}
            />
            <br />
            <input
              type="button"
              value="Authenticate"
              onClick={() => authenticate(applicationToken)}
            />
            <br />
            <p
              style={
                authenticationStatus === "Not Authenticated"
                  ? { color: "red" }
                  : { color: "green" }
              }
            >
              {authenticationStatus}
            </p>
          </label>
        </div>
        <div>
          <hr />
          <h3>Step 2: Find your Device ID</h3>
          <label>
            Device Name: <br />
            <input
              type="text"
              name="deviceName"
              onChange={(e) => setDeviceName(e.target.value)}
              disabled={authenticationToken === "" ? true : false}
            />
            <br />
            <input
              type="button"
              value="Get Device ID"
              onClick={() => getEndpoint(deviceName)}
              disabled={authenticationToken === "" ? true : false}
            />
          </label>
        </div>
        <div>
          <hr />
          <h3>Step 3: Send your Text Message</h3>
          <label>
            Device ID: <br />
            <input
              type="text"
              name="device id"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              disabled={authenticationToken === "" ? true : false}
            />
          </label>
        </div>
        <br />
        <div>
          <label>
            SMS Message:
            <br />
            <input
              type="text"
              name="sms"
              onChange={(e) => setSms(e.target.value)}
              disabled={authenticationToken === "" ? true : false}
            />
            <br />
            <br />
            <input
              type="button"
              value="Send SMS"
              disabled={
                authenticationToken === ""
                  ? true
                  : deviceId === ""
                  ? true
                  : false
              }
              onClick={() => postSms()}
            />{" "}
            <input
              type="button"
              value="Check Status"
              disabled={
                authenticationToken === ""
                  ? true
                  : deviceId === ""
                  ? true
                  : smsId === ""
                  ? true
                  : false
              }
              onClick={() => getSms()}
            />
            <br />
            <br />
            <div style={{ color: "green" }}>{smsStatus}</div>
          </label>
          <hr />
        </div>
      </form>

      <p style={{ fontStyle: "italic" }}>
        This code is for demo purposes only.
      </p>
    </div>
  );
}
