import React, { useState, useEffect } from "react";
import { Mention as MentionUser } from "primereact/mention";

export default function Mention({ projectMember }) {
  const [value, setValue] = useState("");
  const [customers, setCustomers] = useState(projectMember || []);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // //console.log("projectMember",projectMember)
    setCustomers(projectMember || []);
  }, [projectMember]);

  const onSearch = (event) => {
    setTimeout(() => {
      const query = event.query;
      let filteredSuggestions;

      if (!query.trim().length) {
        filteredSuggestions = [...customers];
      } else {
        filteredSuggestions = customers.filter((customer) =>
          customer?.userName.toLowerCase().startsWith(query.toLowerCase())
        );
      }

      setSuggestions(filteredSuggestions);
    }, 250);
  };

  const itemTemplate = (suggestion) => {
    const src = suggestion?.profileImage;

    return (
      <div className="flex align-items-center">
        <img alt={suggestion?.userName} src={src} width="32" />
        <span className="flex flex-column ml-2">
          {suggestion?.userName}
          <small
            style={{ fontSize: ".75rem", color: "var(--text-color-secondary)" }}
          >
            @{suggestion?.userName}
          </small>
        </span>
      </div>
    );
  };

  return (
    <div className="card flex justify-content-center">
      <MentionUser
        value={value}
        onChange={(e) => setValue(e.target.value)}
        suggestions={suggestions}
        onSearch={onSearch}
        field="userName" // Assuming field name is "userName" from your example
        placeholder="Enter @ to mention people"
        rows={5}
        cols={40}
        itemTemplate={itemTemplate}
      />
    </div>
  );
}
