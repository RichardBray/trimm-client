import React from "react";
import { PageHandler } from "../uitls";

class Register extends PageHandler<{}, {}> {
  state = {
    username: "",
    email: "",
    password: ""
  }

  handleSubmit(e: any): void {

  }

  render(): JSX.Element {
    return (
      <section className="dis-f jc-sb">
        <form onSubmit={e => this.handleSubmit(e)}>
          <input
            type="text"
            name="username"
            value={this.state.username}
            placeholder="Your first name"
            onChange={e => this.handleChange(e)}
            required
          />
          <input
            type="text"
            name="email"
            value={this.state.email}
            placeholder="Email Address"
            onChange={e => this.handleChange(e)}
            required
          />
          <input
            type="Password"
            name="password"
            value={this.state.password}
            placeholder="Password"
            onChange={e => this.handleChange(e)}
            required
          />
          <button type="submit" value="Login">Login</button>
        </form>
      </section>
    )
  }  
}

export default Register;