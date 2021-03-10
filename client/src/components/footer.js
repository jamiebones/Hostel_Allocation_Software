import React from "react";
import styled from "styled-components";

const FooterStyles = styled.div`
  #sticky-footer {
    font-size: 16px;
    padding-top: 80px;
  }
`;

const Footer = () => {
  return (
    <FooterStyles>
      <footer
        id="sticky-footer"
        className="py-4 bg-dark text-white-50 fixed-bottom"
      >
        <div className="container text-center">
          <small>Copyright &copy; 2021 - {new Date().getUTCFullYear()}</small>
          &nbsp;
          <small>Powered by Erudite Scholars International</small>
        </div>
      </footer>
    </FooterStyles>
  );
};

export default Footer;
