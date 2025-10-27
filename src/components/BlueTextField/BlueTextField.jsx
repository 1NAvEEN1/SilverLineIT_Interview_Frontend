import { TextField } from "@mui/material";
import { styled } from "@mui/system";

const BlueTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    color: "darkslategray", // Text color
    backgroundColor: "#CEE5F3", // Background color
    padding: 0, // Padding
    borderRadius: 6, // Border radius
    border: "none", // No border
    outline: "none", // No outline
  },
  "& .MuiInputBase-root:hover": {
    backgroundColor: "#f0f8ff", // Lighter background color on hover
  },"& fieldset": { border: "none" }
});

export default function CustomTextField(props) {
  return (
    <BlueTextField
      {...props}
    />
  );
}
