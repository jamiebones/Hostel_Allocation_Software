import React from "react";

import styled from "styled-components";

const TransactionStyles = styled.div`
  p {
    font-size: 20;
  }

  p::after {
    content: <hr/>;
  }

  p > span {
    float: right;
  }
`;

const Transaction = ({ transaction }) => {
  const {
    amount,
    transactionId,
    payerId,
    payerName,
    transactionStatus,
    session,
    date,
    RRR,
    roomDetails: {
      hallName,
      bedSpace,
      roomNumber,
      roomId,
      hallId,
      location,
      roomType,
      bedId,
    },
    successful,
  } = transaction;

  return (
    <TransactionStyles>
      <div>
        <p>
          Name: <span>{payerName}</span>
        </p>
        <p>
          RegNumber : <span>{payerId}</span>{" "}
        </p>

        <p>
          Amount : <span>{amount}</span>
        </p>

        <p>
          Session : <span>{session}</span>
        </p>

        <p>
          RRR : <span>{RRR}</span>
        </p>

        <p>
          Date : <span>{date}</span>
        </p>

        <p>
          Transaction Status : <span>{transactionStatus}</span>
        </p>
        <hr />
        <p className="text-center lead">Room Details</p>

        <p>
          Hall : <span>{hallName}</span>
        </p>

        <p>
          location : <span>{location}</span>
        </p>

        <p>
          Room : <span>{roomNumber}</span>
        </p>

        <p>
          Room Type : <span>{roomType}</span>
        </p>

        <p>
          Bed space : <span>{bedSpace}</span>
        </p>

        {successful && (
          <button className="btn btn-primary">print receipt</button>
        )}
      </div>
    </TransactionStyles>
  );
};

export default Transaction;
