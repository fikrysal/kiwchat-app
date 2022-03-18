import { gql, useMutation } from "@apollo/client";
import { makeStyles, TextField } from "@material-ui/core";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { selectedUserState } from "../../../recoil";
import { useAuth0 } from "@auth0/auth0-react";

const INSERT_MESSAGE = gql`
  mutation MyMutation(
    $message: String = ""
    $formUserId: String = ""
    $toUserId: String = ""
  ) {
    insert_messages_one(
      object: {
        message: $message
        formUserId: $formUserId
        toUserId: $toUserId
      }
    ) {
      id
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  messageForm: {
    overflow: "hidden",
    margin: "20px",
    padding: "0",
  },
}));

const MessageForm = () => {
  const [selectedUser] = useRecoilState(selectedUserState);
  const [message, setmessage] = useState("");
  const { user } = useAuth0();
  const classes = useStyles();
  const [insertMessage] = useMutation(INSERT_MESSAGE, {
    variables: {
      formUserId: user?.sub,
      message: message,
      toUserId: selectedUser.id,
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    insertMessage();
    setmessage("");
  };
  return (
    <form
      className={classes.messageForm}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <TextField
        id="input-message"
        variant="outlined"
        placeholder="type your message..."
        fullWidth={true}
        value={message}
        onChange={(e) => setmessage(e.target.value)}
        style={{ background: "#fff" }}
      />
    </form>
  );
};

export default MessageForm;
