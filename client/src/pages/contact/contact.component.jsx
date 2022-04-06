import React, { useState } from "react";

import { CustomButton } from "../../components/custom-button/custom-button.component";
import {
  ContactPageContainer,
  ContactButtonContainer,
  ContactFormContainer,
  CenterContainer,
  MessageContainer,
} from "./contact.styles";
import { FormInput } from "../../components/form-input/form-input.component";

import axios from "axios";

const ContactPage = () => {
  const [contactInfo, setContactInfo] = useState({
    userName: "",
    email: "",
    message: "",
  });
  const { userName, email, message } = contactInfo;
  const [infoSentSuccess, setInfoSentSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const createdAt = new Date();

    try {
      await axios.post("/api/updateusercontactinfo/", {
        params: {
          userName,
          email,
          message,
          createdAt,
        },
      });
      console.log("succesfully updated user contact info.");
      setInfoSentSuccess(true);
    } catch (err) {
      console.log("failed to update user contact info. ", err);
    }

    try {
      await axios.post("api/sendcontactemailtouser/", {
        params: { name: userName, email },
      });
      console.log("succesfully sent email to user");
    } catch (err) {
      console.log("failed to send email to user. ", err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContactInfo({ ...contactInfo, [name]: value });
  };

  return !infoSentSuccess ? (
    <ContactPageContainer>
      <MessageContainer>
        Got any questions? Let's talk about it.
      </MessageContainer>
      <ContactFormContainer onSubmit={handleSubmit}>
        <FormInput
          name="userName"
          type="name"
          value={userName}
          handleChange={handleChange}
          label="name"
          required
        />
        <FormInput
          name="email"
          type="email"
          value={email}
          handleChange={handleChange}
          label="email"
          required
        />
        <FormInput
          name="message"
          type="textarea"
          value={message}
          handleChange={handleChange}
          label="message"
          required
        />
        <ContactButtonContainer>
          <CustomButton type="submit">Submit</CustomButton>
        </ContactButtonContainer>
      </ContactFormContainer>
    </ContactPageContainer>
  ) : (
    <CenterContainer>
      <MessageContainer>
        Thank you for contacting us! We will get back to you shortly!
      </MessageContainer>
    </CenterContainer>
  );
};

export default ContactPage;
