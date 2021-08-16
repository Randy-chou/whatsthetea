import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { LOGIN } from "../utils/mutations";

import Auth from "../utils/auth";

const LoginForm = () => {
    const [userFormData, setUserFormData] = useState({ email: "", password: "" });
    const [validated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [loginUser] = useMutation(LOGIN_USER);
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setUserFormData({ ...userFormData, [name]: value });
    };
  
    const handleFormSubmit = async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
  
      try {
        const { data } = await loginUser({
          variables: { ...userFormData },
        });
  
        Auth.login(data.login.token);
      } catch (err) {
        console.error(err);
        setShowAlert(true);
      }
  
      setUserFormData({
        username: "",
        email: "",
        password: "",
      });
    };
export default function Login(props) {
    return (
        <>
        <section>
        <form class="login-form ">
  <div class="sign-in-form">
    <h4 class="text-center">Log In</h4>
    <center>
    <p><label for="sign-in-form-email">Email</label></p>
    <input type="text" class="sign-in-form-email" id="sign-in-form-email"></input>
    
    <p><label for="sign-in-form-password">Password</label></p>
    <input type="password" class="sign-in-form-password" id="sign-in-form-password"></input>
   
    <p><button class="button is-link">Sign In</button></p>
    </center>
  </div>
</form>
</section>

<section>
        <form class="signup-form ">
  <div class="sign-up-form">
    <h4 class="text-center">or Sign Up</h4>
    <center>
   <p><label for="sign-up-form-email">Email</label></p>
    <input type="text" class="sign-in-form-email" id="sign-in-form-email"></input>
    
    <p><label for="sign-up-form-username">Username</label></p>
    <input type="text" class="sign-in-form-username" id="sign-in-form-username"></input>
    
   <p><label for="sign-in-form-password">Password</label></p>
    <input type="password" class="password" id="password"></input>

    <p><label for="sign-in-form-password">Confirm Password</label></p>
    <input type="password" class="confirm-password" id="confirm-password"></input>
   
    <h3 class="text-center">Choose a Profile Picture</h3>
    <center><div id="file-js-example" class="file has-name">
        <label class="file-label">
        <input class="file-input" type="file" name="resume"></input>
        <span class="file-cta">
        <span class="file-icon">
        <i class="fas fa-upload"></i>
        </span>
    <span class="file-label"> Upload a profile pic</span></span>
    <span class="file-name"> No file uploaded </span></label>
    </div></center>
   
    
    <p><button class="button is-link">Sign Up</button></p>
    
    </center>
  </div>
</form>
</section>
</>


    );
}}