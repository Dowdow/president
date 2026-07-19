import { useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { setUsername } from "../../session/sessionSlice";

export default function UsernameForm() {
  const dispatch = useAppDispatch();
  const [username, setLocalUsername] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (username.trim() === "") {
      return;
    }
    dispatch(setUsername(username));
  };

  return (
    <div className="w-2/5 mx-auto mt-12 py-10 box">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="flex flex-col mb-2">
          <label>Pseudo</label>
          <input
            type="text"
            name="username"
            maxLength={30}
            placeholder="Pseudo"
            autoComplete="off"
            value={username}
            onChange={(event) => setLocalUsername(event.target.value)}
          />
        </div>
        <div className="flex flex-col mb-2">
          <button className="game-button" type="submit">
            Valider
          </button>
        </div>
      </form>
    </div>
  );
}
