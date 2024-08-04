import React from 'react';

function UsersList({ users }) {
  return (
    <ul id="usersList">
      {Array.from(users).map((user, index) => (
        <li key={index}>
          <span className="user-status"></span>
          <span className="user-name">{user}</span>
        </li>
      ))}
    </ul>
  );
}

export default UsersList;
