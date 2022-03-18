import { gql, useSubscription } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { BubbleChart } from "@material-ui/icons";
import { useRecoilState } from "recoil";
import MessageBubble from "../../../components/MessageBuble";
import { selectedUserState } from "../../../recoil";

const GET_MESSAGE = gql`
  subscription MyQuery($where: messages_bool_exp = {}) {
    messages(where: $where, order_by: { createdAt: asc }) {
      id
      formUserId
      message
      fromuser {
        name
        picture
      }
      createdAt
    }
  }
`;

const Message = () => {
  const [selectedUser] = useRecoilState(selectedUserState);
  const { user } = useAuth0();
  let params = { where: {} };
  if (selectedUser && !selectedUser.id) {
    params.where = {
      toUserId: {
        _is_null: true,
      },
    };
  } else if (selectedUser && selectedUser.id) {
    params.where = {
      _or: [
        {
          formUserId: {
            _eq: user.sub,
          },
          toUserId: {
            _eq: selectedUser.id,
          },
        },
        {
          formUserId: {
            _eq: selectedUser.id,
          },
          toUserId: {
            _eq: user.sub,
          },
        },
      ],
    };
  }
  console.log(params);
  const { data } = useSubscription(GET_MESSAGE, { variables: params });

  setTimeout(() => {
    const cb = document.getElementById("chat-content").parentElement;
    if (cb) {
      cb.scrollTop = cb.scrollHeight;
    }
  }, 200);
  // console.log(selectedUser);
  console.log(data);
  return (
    <div id="chat-content">
      {/* dikasi tanda tanya supaya ga ada data tidak return error */}
      {data?.messages.map((m) => {
        return (
          <MessageBubble
            key={m.id}
            message={m}
            isMe={user.sub === m.formUserId}
          />
        );
      })}
    </div>
  );
};

export default Message;
