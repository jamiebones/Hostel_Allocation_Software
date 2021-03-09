
import React from "react";
import PrintAllocationComponent from "./printAllocationComponent";
const PrintAllocationReceipt = (props) => {
  const { data } = props.location.state;

  return (
    <div>
      <PrintAllocationComponent allocationData={data} />
    </div>
  );
};

export default PrintAllocationReceipt;
