import React from "react";
import styles from "../assets/styles/Login.module.css";
import Navbar from "../components/common/Navbar";

const Login = () => {
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <p className={styles.title}>LOGIN </p>
        <p className={styles.message}>
          Enter your credentials and proceed as a staff.{" "}
        </p>
        <label>
          <input required placeholder type="email" className={styles.input} />
          <span>Email</span>
        </label>
        <label>
          <input
            required
            placeholder
            type="password"
            className={styles.input}
          />
          <span>Password</span>
        </label>
        <label>
          <input
            required
            placeholder
            type="password"
            className={styles.input}
          />
          <span>Confirm password</span>
        </label>
        <button className={styles.submit}>Submit</button>
        <p className={styles.signin}>
          Forgot password? <a href="#">Click here</a>{" "}
        </p>
      </form>
    </div>
  );
};

export default Login;
