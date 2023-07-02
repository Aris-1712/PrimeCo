import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderEditCellParams,
  GridToolbarContainer,
  useGridApiContext,
} from "@mui/x-data-grid";
import { Autocomplete, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "./Table.css";
import { useEffect, useState } from "react";
import { Delete } from "@mui/icons-material";

export default function EditingGrid(props: any) {
  const {
    dnid,
    addRowHandler,
    rowDeleteHandler,
    updateRow,
    rows,
    products,
    customers,
  } = props;
  const [rowId, setRowId] = useState<any>();
  const DropDown = (props: GridRenderEditCellParams) => {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();
    const handleValueChange = (event: any, val: any) => {
      const newValue = val?.label; // The new value entered by the user
      apiRef.current.setEditCellValue({ id, field, value: newValue });
    };
    let dropValue =
      field === "customerId"
        ? customers.find((item: any) => item?.id === value)
        : products.find((item: any) => item?.id === value);

    return (
      <Autocomplete
        id="combo-box-demo"
        defaultValue={dropValue || { id: "", label: "" }}
        options={field === "customerId" ? customers : products}
        sx={{ width: 300 }}
        onChange={handleValueChange}
        renderInput={(params: any) => <TextField {...params} />}
      />
    );
  };

  const columns: GridColDef[] = [
    {
      field: "customerId",
      headerName: "Customer",
      width: 200,
      editable: true,
      renderEditCell: DropDown,
      renderCell: (params: any) => {
        let dropValue =
          params?.field === "customerId"
            ? customers.find((item: any) => item?.id === params?.value)
            : products.find((item: any) => item?.id === params?.value);
        return dropValue?.label;
      },
    },
    {
      field: "productId",
      headerName: "Product",
      width: 200,
      editable: true,
      renderEditCell: DropDown,
      renderCell: (params: any) => {
        let dropValue =
          params?.field === "customerId"
            ? customers.find((item: any) => item?.id === params?.value)
            : products.find((item: any) => item?.id === params?.value);
        return dropValue?.label;
      },
    },
    { field: "qty", headerName: "Quantity", editable: true, width: 200 },
    { field: "location", headerName: "Location", editable: true, width: 200 },
    { field: "remarks", headerName: "Remarks", editable: true, flex: 1 },
  ];

  const customToolbar = () => {
    return (
      <GridToolbarContainer>
        <Button
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => addRowHandler(dnid)}
        >
          Add record
        </Button>
        <Button
          color="primary"
          disabled={!rows?.length}
          startIcon={<Delete />}
          onClick={() => rowDeleteHandler(rowId)}
        >
          Delete row
        </Button>
      </GridToolbarContainer>
    );
  };

  return (
    <div className="table-edit" style={{ width: "100%" }}>
      <DataGrid
        sx={{ minHeight: 400 }}
        slots={{ toolbar: customToolbar }}
        rows={rows}
        columns={columns}
        onRowClick={(params: any) => {
          setRowId(params?.id);
        }}
        processRowUpdate={(updatedRow, originalRow) => {
          updateRow(updatedRow);
          return updatedRow;
        }}
      />
    </div>
  );
}
